import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  Coffee,
  Check,
  ChevronDown,
  ChevronRight,
  Flame,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask, RoadmapPlan } from '../../types';
import { MascotBrain } from '../mascots/MascotBrain';

export const RoadmapScreen: React.FC = () => {
  const {
    roadmapPlan,
    setRoadmapPlan,
    toggleRoadmapTask,
    toggleRoadmapSubstep,
    rewardDiamond,
    setActiveScreen,
    language,
    diamonds
  } = useApp();

  const [rawInput, setRawInput] = useState('');
  const [availableHours, setAvailableHours] = useState<number>(3);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'schedule'>('tasks');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New manual task fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualCourse, setManualCourse] = useState('');
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualPriority, setManualPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const presets = [
    {
      title: "Exams & PFE Prep 📚",
      text: "Examen Réseaux & Télécom dans 3 jours (Chapitres 3, 4 et 5), Rapport de stage PFE de 15 pages à finaliser, et 2 exercices de TD d'Algorithmique."
    },
    {
      title: "Midterm Week Overload ⏳",
      text: "Maths exam on Friday, Physics lab report due Tuesday night, presentation slides for Economics on Monday."
    },
    {
      title: "Catching Up from Fatigue 🌙",
      text: "Behind on 3 lectures in Architecture, need to review design studio notes, have low mental energy."
    }
  ];

  const handleGenerateRoadmap = async (inputText = rawInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/roadmap-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: inputText,
          availableHoursPerDay: availableHours,
          energyLevel,
          language
        })
      });

      const data = await res.json();
      if (data.plan) {
        setRoadmapPlan(data.plan);
      }
    } catch (err) {
      console.error('Roadmap error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleUnfinished = async () => {
    if (!roadmapPlan) return;
    setIsRescheduling(true);

    const unfinishedIds = roadmapPlan.tasks
      .filter(t => t.status !== 'completed')
      .map(t => t.id);

    try {
      const res = await fetch('/api/roadmap-reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTasks: roadmapPlan.tasks,
          unfinishedTaskIds: unfinishedIds,
          availableHoursPerDay: availableHours,
          language
        })
      });

      const data = await res.json();
      if (data.rescheduledTasks) {
        setRoadmapPlan({
          ...roadmapPlan,
          tasks: data.rescheduledTasks
        });
      }
    } catch (err) {
      console.error('Reschedule error:', err);
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleAddManualTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newTask: RoadmapTask = {
      id: `task-${Date.now()}`,
      title: manualTitle.trim(),
      course: manualCourse.trim() || 'General',
      estimated_minutes: manualMinutes,
      priority: manualPriority,
      status: 'pending',
      substeps: [
        { id: `sub-${Date.now()}-1`, title: 'Get materials ready & outline plan', duration_minutes: 10, completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Focused execution sprint', duration_minutes: Math.max(10, manualMinutes - 10), completed: false }
      ]
    };

    if (roadmapPlan) {
      setRoadmapPlan({
        ...roadmapPlan,
        tasks: [newTask, ...roadmapPlan.tasks]
      });
    } else {
      setRoadmapPlan({
        analysis: {
          totalTasks: 1,
          estimatedTotalMinutes: manualMinutes,
          workloadFeasibility: 'manageable'
        },
        priorityRationale: 'Manually added custom study priority.',
        tasks: [newTask],
        schedule: [
          {
            dayName: 'Today',
            dateStr: new Date().toISOString().split('T')[0],
            blocks: [
              { id: 'b-manual', type: 'task', title: newTask.title, duration_minutes: manualMinutes, taskId: newTask.id },
              { id: 'b-break', type: 'break', title: 'Restorative Breathing Break', duration_minutes: 15 }
            ]
          }
        ],
        bufferNotice: '15 min buffer included.'
      });
    }

    setShowNewTaskModal(false);
    setManualTitle('');
    setManualCourse('');
  };

  const handleTakeBreak = (blockId: string, title: string) => {
    rewardDiamond(5, `Restorative break completed: ${title}`, 'restorative_break', `break-${blockId}`);
    setActiveScreen('breathing');
  };

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-3">
        <div>
          <span className="text-xs font-bold text-[#6F8D45] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            AI Task Roadmap
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#202019] mt-0.5">
            My Roadmap
          </h1>
        </div>

        {/* Diamond pill linking to Garden */}
        <button
          onClick={() => setActiveScreen('garden')}
          className="flex items-center gap-1.5 bg-[#FFF0D4] hover:bg-[#FFE5B8] border border-[#F5D547] text-[#825C08] px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <span>💎</span>
          <span>{diamonds}</span>
        </button>
      </header>

      {/* Input or Summary view */}
      {!roadmapPlan && (
        <div className="bg-white rounded-3xl p-5 border border-[#ECE7D4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] mt-2">
          <div className="flex items-center gap-3 mb-3">
            <MascotBrain size="sm" animated={false} />
            <div>
              <h2 className="text-sm font-bold text-[#202019]">
                Turn heavy workloads into clear steps
              </h2>
              <p className="text-xs text-[#737264]">
                Paste your syllabus, deadlines, or revision topics below.
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5 mb-3">
            <span className="text-[11px] font-bold text-[#8C8A7B] uppercase block">
              Quick Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRawInput(p.text);
                    handleGenerateRoadmap(p.text);
                  }}
                  className="text-[11px] bg-[#F8F5E4] hover:bg-[#F5F0D2] border border-[#ECE7D4] text-[#555447] px-2.5 py-1 rounded-full font-medium transition-all"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="e.g. 2 upcoming exams in Macroeconomics and Law next Tuesday, a 10-page report due in 5 days, 3 problem sets..."
            rows={4}
            className="w-full bg-[#FBF9F1] rounded-2xl p-3 text-xs text-[#202019] placeholder:text-[#A3A194] border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45] resize-none mb-3"
          />

          {/* Parameters: Available Hours & Energy */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold text-[#737264] block mb-1">
                Hours Available / Day
              </label>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 6].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setAvailableHours(hrs)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      availableHours === hrs
                        ? 'bg-[#3D5834] text-white border-[#3D5834]'
                        : 'bg-white border-[#ECE7D4] text-[#555447] hover:bg-[#F8F5E4]'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#737264] block mb-1">
                Current Energy
              </label>
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      energyLevel === lvl
                        ? 'bg-[#3D5834] text-white border-[#3D5834]'
                        : 'bg-white border-[#ECE7D4] text-[#555447] hover:bg-[#F8F5E4]'
                    }`}
                  >
                    {lvl === 'low' ? '🪫' : lvl === 'medium' ? '🔋' : '⚡'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleGenerateRoadmap()}
            disabled={isLoading || !rawInput.trim()}
            className="w-full bg-[#1C1C17] hover:bg-black disabled:opacity-50 text-white font-bold text-xs py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#F8D45A]" />
                <span>Crafting realistic roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F8D45A]" />
                <span>Generate My Roadmap</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Active Roadmap View */}
      {roadmapPlan && (
        <div className="space-y-4 mt-2">
          {/* Feasibility & Priority Banner */}
          <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                roadmapPlan.analysis.workloadFeasibility === 'manageable'
                  ? 'bg-emerald-100 text-emerald-800'
                  : roadmapPlan.analysis.workloadFeasibility === 'tight'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {roadmapPlan.analysis.workloadFeasibility === 'manageable'
                  ? '✓ Workload Manageable'
                  : roadmapPlan.analysis.workloadFeasibility === 'tight'
                  ? '⚠ Tight Pace • Buffers Active'
                  : '⚡ Overloaded • Needs Trim'}
              </span>

              <span className="text-xs font-semibold text-[#737264] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{Math.round(roadmapPlan.analysis.estimatedTotalMinutes / 60)}h total
              </span>
            </div>

            <p className="text-xs font-medium text-[#202019] leading-relaxed">
              {roadmapPlan.priorityRationale}
            </p>

            {roadmapPlan.analysis.conflictExplanation && (
              <p className="text-[11px] text-[#A37213] bg-[#FFFBEB] p-2.5 rounded-xl border border-[#FDE68A] mt-2">
                {roadmapPlan.analysis.conflictExplanation}
              </p>
            )}
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center justify-between gap-1 bg-[#F5F0D2] p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'tasks' ? 'bg-white text-[#202019] shadow-xs' : 'text-[#737264] hover:text-[#202019]'
              }`}
            >
              Task Checklist
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'schedule' ? 'bg-white text-[#202019] shadow-xs' : 'text-[#737264] hover:text-[#202019]'
              }`}
            >
              Daily Schedule
            </button>
          </div>

          {/* TAB 1: Task Checklist with Substeps */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737264]">
                  Micro-Steps (+10 💎 on completion)
                </h3>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="text-xs text-[#3D5834] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add task
                </button>
              </div>

              {roadmapPlan.tasks.map((task) => {
                const isTaskDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      isTaskDone
                        ? 'border-[#A8BC78] bg-[#F4F6EE] opacity-85'
                        : 'border-[#ECE7D4] shadow-xs hover:border-[#6F8D45]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => toggleRoadmapTask(task.id)}
                        className="flex items-start gap-2.5 text-left flex-1 cursor-pointer"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            isTaskDone
                              ? 'text-[#6F8D45] fill-[#6F8D45]/20'
                              : 'text-[#C5C3B6] hover:text-[#6F8D45]'
                          }`}
                        />
                        <div>
                          <span className={`text-xs font-bold leading-snug ${isTaskDone ? 'line-through text-[#737264]' : 'text-[#202019]'}`}>
                            {task.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold bg-[#F5F0D2] text-[#555447] px-2 py-0.5 rounded-full">
                              {task.course}
                            </span>
                            {task.deadline && (
                              <span className="text-[10px] text-[#A37213] font-medium">
                                ⏰ {task.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>

                      <span className="text-[10px] font-bold bg-[#F8F5E4] text-[#555447] px-2 py-1 rounded-full flex-shrink-0">
                        {task.estimated_minutes} min
                      </span>
                    </div>

                    {/* Substeps Breakdown */}
                    {task.substeps && task.substeps.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#F2EFE2] space-y-1.5 pl-7">
                        {task.substeps.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => toggleRoadmapSubstep(task.id, sub.id)}
                            className="w-full flex items-center justify-between text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {sub.completed ? (
                                <Check className="w-3.5 h-3.5 text-[#6F8D45]" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[#C5C3B6] group-hover:text-[#6F8D45]" />
                              )}
                              <span className={`text-[11px] ${sub.completed ? 'line-through text-[#8C8A7B]' : 'text-[#4A493D]'}`}>
                                {sub.title}
                              </span>
                            </div>
                            <span className="text-[9px] text-[#8C8A7B]">
                              {sub.duration_minutes}m
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Reschedule Button */}
              <div className="pt-2">
                <button
                  onClick={handleRescheduleUnfinished}
                  disabled={isRescheduling}
                  className="w-full bg-[#FAF5E2] hover:bg-[#F5F0D2] border border-[#ECE7D4] text-[#3D5834] font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRescheduling ? 'animate-spin' : ''}`} />
                  <span>Reschedule unfinished tasks without guilt</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Daily Schedule Timeline with Restorative Breaks */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <p className="text-xs text-[#737264] px-1">
                Paced blocks with restorative buffer intervals:
              </p>

              {roadmapPlan.schedule.map((day, dIdx) => (
                <div key={dIdx} className="bg-white rounded-2xl p-4 border border-[#ECE7D4] shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#F2EFE2] pb-2 mb-3">
                    <span className="text-xs font-bold text-[#202019]">
                      {day.dayName}
                    </span>
                    <span className="text-[11px] text-[#737264]">
                      {day.dateStr}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {day.blocks.map((block, bIdx) => {
                      if (block.type === 'break') {
                        return (
                          <div
                            key={bIdx}
                            onClick={() => handleTakeBreak(block.id, block.title)}
                            className="bg-[#EBF6FD] hover:bg-[#DDEFFB] border border-[#39A9E8]/30 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <Coffee className="w-4 h-4 text-[#155C82]" />
                              <div>
                                <p className="text-xs font-bold text-[#155C82]">
                                  {block.title}
                                </p>
                                <span className="text-[10px] text-[#297EA6]">
                                  Restorative break (+5 💎)
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold bg-white text-[#155C82] px-2 py-0.5 rounded-full">
                              {block.duration_minutes} min
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={bIdx}
                          className="bg-[#FAF7EE] rounded-xl p-2.5 flex items-center justify-between border border-[#ECE7D4]"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#6F8D45]" />
                            <span className="text-xs font-medium text-[#202019]">
                              {block.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#555447]">
                            {block.duration_minutes}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reset / New Roadmap Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                if (window.confirm("Start a new roadmap from scratch?")) {
                  setRoadmapPlan(null);
                }
              }}
              className="text-xs font-semibold text-[#8C8A7B] hover:text-[#202019] underline cursor-pointer"
            >
              Clear & Create New Roadmap
            </button>
          </div>
        </div>
      )}

      {/* Manual Add Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#ECE7D4]">
            <h3 className="text-sm font-bold text-[#202019] mb-3">
              Add New Study Task
            </h3>
            <form onSubmit={handleAddManualTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#737264] block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Solve 3 differential equations"
                  className="w-full text-xs bg-[#F8F5E4] rounded-xl p-2.5 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#737264] block mb-1">
                  Course or Module
                </label>
                <input
                  type="text"
                  value={manualCourse}
                  onChange={(e) => setManualCourse(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full text-xs bg-[#F8F5E4] rounded-xl p-2.5 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#737264] block mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(Number(e.target.value))}
                    min={5}
                    max={180}
                    step={5}
                    className="w-full text-xs bg-[#F8F5E4] rounded-xl p-2.5 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#737264] block mb-1">
                    Priority
                  </label>
                  <select
                    value={manualPriority}
                    onChange={(e) => setManualPriority(e.target.value as any)}
                    className="w-full text-xs bg-[#F8F5E4] rounded-xl p-2.5 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 text-xs font-bold text-[#737264] py-2.5 rounded-full hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1C1C17] text-white text-xs font-bold py-2.5 rounded-full hover:bg-black"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
