export interface AssessmentInterface {
  type: string
  title: string
  description: string
  components: InterfaceComponent[]
  interactions: InteractionHandler[]
  evaluation: EvaluationCriteria
  styling: InterfaceStyle
}

export interface InterfaceComponent {
  id: string
  type: 'input' | 'textarea' | 'canvas' | 'video' | 'audio' | 'collaborative-board' | 'simulation-panel' | 'metrics-dashboard' | 'timeline' | 'workflow-designer' | 'custom'
  label: string
  placeholder?: string
  validation?: ValidationRule[]
  props: Record<string, any>
  layout: ComponentLayout
}

export interface InteractionHandler {
  trigger: string
  action: string
  feedback: FeedbackType
  evaluation: string
}

export interface EvaluationCriteria {
  primary: string[]
  secondary: string[]
  scoring: ScoringMethod
  aiPrompts: string[]
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value: any
  message: string
}

export interface ComponentLayout {
  width: string
  height: string
  position: 'left' | 'right' | 'center' | 'full'
  order: number
}

export interface FeedbackType {
  immediate: boolean
  detailed: boolean
  adaptive: boolean
  style: 'encouraging' | 'analytical' | 'strategic' | 'technical'
}

export interface ScoringMethod {
  algorithm: 'weighted' | 'rubric' | 'adaptive' | 'peer-comparison'
  factors: string[]
  weights: number[]
}

export interface InterfaceStyle {
  theme: 'professional' | 'creative' | 'technical' | 'collaborative' | 'simulation'
  colors: ColorScheme
  layout: 'split' | 'tabbed' | 'dashboard' | 'immersive'
}

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
}
