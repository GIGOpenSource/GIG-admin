// 玩法基础信息
export interface GameplayInfo {
  id: number;
  name: string;
  type: 'daily' | 'event' | 'special';
  status: 'active' | 'inactive';
  description: string;
  conditions: string;
  rewards: string;
  participant_count: number;
  create_time: string;
  update_time: string;
}

// 玩法配置
export interface GameplayConfig {
  id: number;
  gameplay_id: number;
  start_time: string;
  end_time: string;
  max_participants: number;
  participation_fee: number;
  rules: string;
  rewards: RewardItem[];
  special_settings: string[];
}

// 奖励项
export interface RewardItem {
  name: string;
  quantity: number;
  probability: number;
}

// 玩法规则
export interface GameplayRule {
  id: number;
  name: string;
  type: 'participation' | 'reward' | 'penalty' | 'special';
  gameplay_id: number;
  gameplay_name: string;
  status: 'active' | 'inactive';
  content: string;
  description: string;
  priority: number;
  conditions: string;
  create_time: string;
  update_time: string;
}

// 玩法列表查询参数
export interface GameplayListParams {
  name?: string;
  status?: string;
  type?: string;
  currentPage?: number;
  pageSize?: number;
}

// 玩法规则列表查询参数
export interface GameplayRuleListParams {
  name?: string;
  type?: string;
  status?: string;
  gameplay_id?: number;
  currentPage?: number;
  pageSize?: number;
}

// 创建玩法表单
export interface CreateGameplayForm {
  name: string;
  type: string;
  status: string;
  description: string;
  conditions: string;
  rewards: string;
}

// 更新玩法表单
export interface UpdateGameplayForm extends CreateGameplayForm {
  id: number;
}

// 创建玩法规则表单
export interface CreateGameplayRuleForm {
  name: string;
  type: string;
  gameplay_id: number | null;
  status: string;
  content: string;
  description: string;
  priority: number;
  conditions: string;
}

// 更新玩法规则表单
export interface UpdateGameplayRuleForm extends CreateGameplayRuleForm {
  id: number;
}

// 玩法配置表单
export interface GameplayConfigForm {
  id: number;
  start_time: string;
  end_time: string;
  max_participants: number;
  participation_fee: number;
  rules: string;
  rewards: RewardItem[];
  special_settings: string[];
}
