"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, DragOverlay, closestCenter, useSensor, useSensors,
  PointerSensor, KeyboardSensor, DragStartEvent, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Search, GripVertical, X, BookOpen, ChevronRight,
  AlertCircle, CheckCircle2, AlertTriangle, Info, Zap, Shield,
  Route, Target, Plus, Save, RotateCcw, Sparkles,
  GraduationCap, Briefcase,
} from "lucide-react";
import {
  Button, Badge, Card, Input, EmptyState, Progress,
} from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { validatePathway } from "@/lib/validations/pathway-validator";
import {
  cn, formatCurrency, formatDuration, getDifficultyColor,
} from "@/lib/utils";
import type { Module, PathwayItem, PathwayItemType, PathwayValidation } from "@/types";

// ============================================
// Sortable Pathway Item
// ============================================
function SortablePathwayItem({
  item,
  module,
  onRemove,
  onTypeChange,
}: {
  item: PathwayItem;
  module: Module;
  onRemove: (id: string) => void;
  onTypeChange: (id: string, type: PathwayItemType) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeColors: Record<string, string> = {
    core: "border-l-emerald-500 bg-emerald-50/30",
    elective: "border-l-blue-500 bg-blue-50/30",
    specialization: "border-l-purple-500 bg-purple-50/30",
    capstone: "border-l-amber-500 bg-amber-50/30",
    milestone: "border-l-slate-500 bg-slate-50/30",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 border-l-4 transition-all group",
        typeColors[item.item_type] || "border-l-slate-300",
        isDragging && "shadow-lg opacity-75 z-50 scale-[1.02]",
        item.is_locked && "opacity-60"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-500"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900 truncate">{module.title}</span>
          {item.is_completed && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-400">{module.credits} credits</span>
          <span className="text-xs text-slate-300">·</span>
          <span className={cn("text-xs capitalize", getDifficultyColor(module.difficulty).split(" ")[0])}>
            {module.difficulty}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">
            {module.pricing_model === "free" ? "Free" : formatCurrency(module.cost_cents)}
          </span>
        </div>
      </div>

      {/* Type selector */}
      <select
        value={item.item_type}
        onChange={(e) => onTypeChange(item.id, e.target.value as PathwayItemType)}
        className="text-[10px] font-medium border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
      >
        <option value="core">Core</option>
        <option value="elective">Elective</option>
        <option value="specialization">Specialization</option>
        <option value="capstone">Capstone</option>
      </select>

      <button
        onClick={() => onRemove(item.id)}
        className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ============================================
// Main Pathway Builder
// ============================================
export default function PathwayBuilderPage() {
  const [allModules, setAllModules] = React.useState<Module[]>([]);
  const supabaseClient = createSupabaseBrowser();
  React.useEffect(() => { supabaseClient.from("modules").select("*").eq("is_published", true).order("title").then(({ data }) => { if (data) setAllModules(data as Module[]); }); }, []);
  const [template, setTemplate] = React.useState<any>(null);
  React.useEffect(() => { supabaseClient.from("pathway_templates").select("*").eq("is_published", true).limit(1).single().then(({ data }) => { if (data) setTemplate(data); }); }, []); // Full Stack Developer

  const [search, setSearch] = useState("");
  const [pathwayItems, setPathwayItems] = useState<PathwayItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filterFree, setFilterFree] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Build modules map
  const modulesMap = useMemo(() => {
    const map = new Map<string, Module>();
    allModules.forEach((m) => map.set(m.id, m));
    return map;
  }, [allModules]);

  // Validate pathway
  const validation: PathwayValidation = useMemo(
    () => validatePathway(pathwayItems, modulesMap, template as any),
    [pathwayItems, modulesMap, template]
  );

  // Filter available modules
  const availableModules = useMemo(() => {
    const addedIds = new Set(pathwayItems.map((i) => i.module_id));
    let mods = allModules.filter((m) => !addedIds.has(m.id) && m.is_published);

    if (search) {
      const q = search.toLowerCase();
      mods = mods.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.competency_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filterFree) {
      mods = mods.filter((m) => m.pricing_model === "free");
    }

    return mods;
  }, [allModules, pathwayItems, search, filterFree]);

  // Handlers
  const addModule = useCallback((module: Module, type: PathwayItemType = "core") => {
    const newItem: PathwayItem = {
      id: `pi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      pathway_id: "new",
      module_id: module.id,
      module,
      item_type: type,
      position: pathwayItems.length,
      is_completed: false,
      is_locked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPathwayItems((prev) => [...prev, newItem]);
  }, [pathwayItems.length]);

  const removeItem = useCallback((id: string) => {
    setPathwayItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const changeItemType = useCallback((id: string, type: PathwayItemType) => {
    setPathwayItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, item_type: type } : i))
    );
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setPathwayItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        position: idx,
      }));
    });
  };

  const statusColor = {
    valid: "text-emerald-600",
    warning: "text-amber-600",
    invalid: "text-red-600",
  }[validation.status];

  const statusIcon = {
    valid: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    invalid: <AlertCircle className="h-5 w-5 text-red-500" />,
  }[validation.status];

  return (
    <DashboardShell>
      <PageHeader
        title="Pathway Builder"
        description="Drag modules from the catalogue into your pathway. Our validation engine checks every combination."
        breadcrumbs={[
          { label: "Pathways", href: "/pathways" },
          { label: "New Pathway" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPathwayItems([])}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1.5" />
              Save Pathway
            </Button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-140px)]">
        {/* Left: Module Catalogue */}
        <div className="w-[340px] border-r border-slate-200 bg-white flex flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Module Catalogue
            </h3>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterFree(!filterFree)}
                className={cn(
                  "text-xs px-2 py-1 rounded-full border transition-colors",
                  filterFree
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "text-slate-500 border-slate-200 hover:bg-slate-50"
                )}
              >
                Free only
              </button>
              <span className="text-xs text-slate-400">
                {availableModules.length} available
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {availableModules.map((mod) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group cursor-pointer"
                  onClick={() => addModule(mod)}
                >
                  <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800 truncate">{mod.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>{mod.credits} cr</span>
                      <span>·</span>
                      <span className="capitalize">{mod.difficulty}</span>
                      {mod.pricing_model === "free" && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 font-medium">Free</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center: Pathway Canvas */}
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
          {/* Pathway Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Route className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold font-display text-slate-900">
                    {template?.title || "Custom Pathway"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {pathwayItems.length} modules · {validation.total_credits}/{validation.required_credits} credits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon}
                <span className={cn("text-sm font-medium", statusColor)}>
                  {validation.status === "valid"
                    ? "Valid Pathway"
                    : validation.status === "warning"
                    ? "Needs Review"
                    : "Requirements Not Met"}
                </span>
              </div>
            </div>
            {/* Credit progress */}
            <div className="mt-3">
              <Progress
                value={(validation.total_credits / validation.required_credits) * 100}
                variant={
                  validation.total_credits >= validation.required_credits
                    ? "success"
                    : validation.total_credits > validation.required_credits * 0.5
                    ? "warning"
                    : "default"
                }
              />
              <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
                <span>Core: {validation.core_credits} credits</span>
                <span>Elective: {validation.elective_credits} credits</span>
                <span>Total: {validation.total_credits}/{validation.required_credits}</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pathwayItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {pathwayItems.length > 0 ? (
                  <div className="space-y-2 max-w-2xl mx-auto">
                    {pathwayItems.map((item) => {
                      const mod = modulesMap.get(item.module_id);
                      if (!mod) return null;
                      return (
                        <SortablePathwayItem
                          key={item.id}
                          item={item}
                          module={mod}
                          onRemove={removeItem}
                          onTypeChange={changeItemType}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Route className="h-10 w-10" />}
                    title="Start building your pathway"
                    description="Click modules from the catalogue on the left to add them here. Drag to reorder. Our validation engine will check your pathway in real-time."
                    action={
                      <Button variant="outline" onClick={() => addModule(allModules[0])}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add First Module
                      </Button>
                    }
                    className="py-24"
                  />
                )}
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <div className="px-3 py-2.5 rounded-lg border-2 border-emerald-400 bg-white shadow-xl text-sm font-medium text-slate-900">
                    {modulesMap.get(
                      pathwayItems.find((i) => i.id === activeId)?.module_id || ""
                    )?.title || "Module"}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Right: Validation Panel */}
        <div className="w-[300px] border-l border-slate-200 bg-white flex flex-col shrink-0 hidden xl:flex">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Pathway Validation
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Summary Ring */}
            <div className="flex justify-center py-2">
              <ProgressRing
                value={Math.min(100, (validation.total_credits / validation.required_credits) * 100)}
                size={90}
                strokeWidth={7}
                label={`${validation.total_credits}`}
                sublabel={`of ${validation.required_credits} cr`}
                color={
                  validation.status === "valid"
                    ? "#059669"
                    : validation.status === "warning"
                    ? "#d97706"
                    : "#dc2626"
                }
              />
            </div>

            {/* Issues */}
            {validation.issues.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Issues ({validation.issues.length})
                </h4>
                <div className="space-y-2">
                  {validation.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2 p-2.5 rounded-lg text-xs",
                        issue.type === "error" && "bg-red-50 text-red-700",
                        issue.type === "warning" && "bg-amber-50 text-amber-700",
                        issue.type === "info" && "bg-blue-50 text-blue-700"
                      )}
                    >
                      {issue.type === "error" ? (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      ) : issue.type === "warning" ? (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      )}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Requirements */}
            {validation.missing_requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Missing Requirements
                </h4>
                <div className="space-y-1.5">
                  {validation.missing_requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {validation.suggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Suggestions
                </h4>
                <div className="space-y-1.5">
                  {validation.suggestions.map((sug, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Affordability */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Cost Summary
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated total</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(validation.affordability.total_cost_cents)}
                  </span>
                </div>
                {validation.affordability.free_alternatives > 0 && (
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 p-2 rounded">
                    <Zap className="h-3 w-3" />
                    {validation.affordability.free_alternatives} paid modules have free alternatives
                  </div>
                )}
              </div>
            </div>

            {/* All valid message */}
            {validation.is_valid && pathwayItems.length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-emerald-800">Pathway is valid!</div>
                  <div className="text-xs text-emerald-600">All requirements are met.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
