import { motion } from 'framer-motion'
import { memo } from 'react'

import { PIPELINE_STEPS } from '@/constants'
import { cn } from '@/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface PipelineVizProps {
  currentStep: number
}

// ─── Step Node ─────────────────────────────────────────────────────────────

interface StepNodeProps {
  step: (typeof PIPELINE_STEPS)[number]
  isDone: boolean
  isActive: boolean
}

const StepNode = memo(({ step, isDone, isActive }: StepNodeProps) => (
  <div
    className={cn(
      'flex flex-col items-center gap-1.5 flex-1',
      'transition-opacity duration-400',
      isDone ? 'opacity-100' : 'opacity-20',
    )}
  >
    {/* Circle */}
    <motion.div
      animate={
        isActive
          ? { boxShadow: ['0 0 0px rgba(37,99,235,0)', '0 0 20px rgba(37,99,235,0.7)', '0 0 0px rgba(37,99,235,0)'] }
          : {}
      }
      transition={{ duration: 1, repeat: Infinity }}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center',
        'text-xs font-bold transition-all duration-400',
        isDone
          ? 'bg-gradient-to-br from-brand-600 to-accent-600 text-white'
          : 'bg-space-500 text-slate-800',
      )}
    >
      {isDone ? (
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          ✓
        </motion.span>
      ) : (
        <span>{step.id}</span>
      )}
    </motion.div>

    {/* Label */}
    <div className="text-center">
      <p
        className={cn(
          'text-2xs font-semibold transition-colors duration-300',
          isDone ? 'text-slate-300' : 'text-slate-800',
        )}
      >
        {step.label}
      </p>
      <p className="text-2xs text-slate-800 mt-0.5">{step.description}</p>
    </div>
  </div>
))
StepNode.displayName = 'StepNode'

// ─── Connector Line ────────────────────────────────────────────────────────

interface ConnectorProps {
  isPassed: boolean
}

const Connector = memo(({ isPassed }: ConnectorProps) => (
  <div className="relative h-0.5 w-5 shrink-0 mx-0.5 mt-[-18px]">
    <div className="absolute inset-0 bg-space-400 rounded-full" />
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isPassed ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    />
  </div>
))
Connector.displayName = 'Connector'

// ─── Pipeline Viz Component ────────────────────────────────────────────────

export const PipelineViz = memo(({ currentStep }: PipelineVizProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-space-300 p-4 mb-3',
        'bg-space-800/45 backdrop-blur-md',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="text-brand-500 text-sm"
        >
          ⚡
        </motion.span>
        <span className="text-2xs font-bold text-brand-400 tracking-widest uppercase">
          RAG Pipeline Running
        </span>
        <div className="flex-1" />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
              className="w-1 h-1 rounded-full bg-brand-500"
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-start">
        {PIPELINE_STEPS.flatMap((step, i) => {
          const isDone = currentStep >= step.id
          const isActive = currentStep === step.id
          const nodes: React.ReactNode[] = [
            <StepNode key={step.id} step={step} isDone={isDone} isActive={isActive} />,
          ]
          if (i < PIPELINE_STEPS.length - 1) {
            nodes.push(<Connector key={`line-${i}`} isPassed={currentStep > step.id} />)
          }
          return nodes
        })}
      </div>

      {/* Status text */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xs text-slate-700 mt-3 text-center"
      >
        {currentStep === 0 && 'Initializing pipeline…'}
        {currentStep === 1 && 'Parsing file content and extracting metadata…'}
        {currentStep === 2 && 'Splitting documents into 512-token chunks…'}
        {currentStep === 3 && 'Generating semantic embeddings via ada-002…'}
        {currentStep === 4 && 'Running cosine similarity retrieval…'}
        {currentStep === 5 && 'Claude is synthesizing your answer…'}
      </motion.p>
    </motion.div>
  )
})

PipelineViz.displayName = 'PipelineViz'