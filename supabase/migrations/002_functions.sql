-- ============================================
-- Additional Supabase Functions
-- Run after initial migration
-- ============================================

-- Increment enrollment count atomically
CREATE OR REPLACE FUNCTION increment_enrollment_count(mod_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE modules
  SET enrollment_count = enrollment_count + 1
  WHERE id = mod_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get learner dashboard stats
CREATE OR REPLACE FUNCTION get_learner_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_enrollments', (SELECT COUNT(*) FROM enrollments WHERE user_id = p_user_id),
    'completed_modules', (SELECT COUNT(*) FROM enrollments WHERE user_id = p_user_id AND status = 'completed'),
    'in_progress', (SELECT COUNT(*) FROM enrollments WHERE user_id = p_user_id AND status = 'in_progress'),
    'total_credits_earned', (
      SELECT COALESCE(SUM(m.credits), 0)
      FROM enrollments e
      JOIN modules m ON m.id = e.module_id
      WHERE e.user_id = p_user_id AND e.status = 'completed'
    ),
    'credentials_count', (SELECT COUNT(*) FROM credentials WHERE user_id = p_user_id),
    'active_remediations', (
      SELECT COUNT(*) FROM remediation_assignments
      WHERE user_id = p_user_id AND status IN ('recommended', 'enrolled', 'in_progress')
    ),
    'pathways_count', (SELECT COUNT(*) FROM pathways WHERE user_id = p_user_id AND status IN ('draft', 'active'))
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-trigger remediation on low assessment score
CREATE OR REPLACE FUNCTION check_remediation_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- If assessment score is below 50% and module has remediation resources
  IF NEW.passed = false AND NEW.score < 50 THEN
    -- Check if module has remediation resources
    IF EXISTS (
      SELECT 1 FROM remediation_resources rr
      JOIN assessments a ON a.module_id = rr.module_id
      WHERE a.id = NEW.assessment_id
    ) THEN
      -- Auto-assign remediation
      INSERT INTO remediation_assignments (user_id, module_id, resource_id, trigger, status, score_before)
      SELECT
        NEW.user_id,
        a.module_id,
        rr.id,
        'low_quiz_score',
        'recommended',
        NEW.score
      FROM assessments a
      JOIN remediation_resources rr ON rr.module_id = a.module_id
      WHERE a.id = NEW.assessment_id
      LIMIT 3
      ON CONFLICT DO NOTHING;

      -- Create notification
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (
        NEW.user_id,
        'Remediation Recommended',
        'Based on your recent assessment score, we''ve prepared targeted support to help you succeed.',
        'remediation',
        '/support'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_assessment_attempt
AFTER INSERT ON assessment_attempts
FOR EACH ROW EXECUTE FUNCTION check_remediation_trigger();

-- Issue credential on milestone completion
CREATE OR REPLACE FUNCTION check_milestone_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_pathway RECORD;
  v_milestone RECORD;
  v_earned_credits INTEGER;
BEGIN
  -- Only check when enrollment is completed
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    -- Check all pathways for this user
    FOR v_pathway IN
      SELECT p.* FROM pathways p WHERE p.user_id = NEW.user_id AND p.status = 'active'
    LOOP
      -- Calculate earned credits
      SELECT COALESCE(SUM(m.credits), 0) INTO v_earned_credits
      FROM enrollments e
      JOIN modules m ON m.id = e.module_id
      WHERE e.user_id = NEW.user_id AND e.status = 'completed';

      -- Update pathway earned credits
      UPDATE pathways SET earned_credits = v_earned_credits WHERE id = v_pathway.id;

      -- Check milestones
      FOR v_milestone IN
        SELECT * FROM milestones
        WHERE pathway_template_id = v_pathway.template_id
        AND credits_required <= v_earned_credits
        AND id NOT IN (SELECT milestone_id FROM credentials WHERE user_id = NEW.user_id AND milestone_id IS NOT NULL)
      LOOP
        -- Issue milestone credential
        INSERT INTO credentials (user_id, type, title, description, issuer, credential_hash, is_verified, milestone_id, pathway_id)
        VALUES (
          NEW.user_id,
          v_milestone.credential_type,
          v_milestone.title,
          v_milestone.description,
          'SkillWeave SA',
          'SW-' || substring(md5(random()::text) from 1 for 20),
          true,
          v_milestone.id,
          v_pathway.id
        );

        -- Create celebration notification
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (
          NEW.user_id,
          'Milestone Achieved! 🎉',
          'Congratulations! You''ve earned the "' || v_milestone.title || '" milestone.',
          'milestone',
          '/wallet'
        );
      END LOOP;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_enrollment_update
AFTER INSERT OR UPDATE ON enrollments
FOR EACH ROW EXECUTE FUNCTION check_milestone_completion();
