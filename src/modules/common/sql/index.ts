export const SQL = {
  GET_INSTANCE:
    'SELECT `id`, `group_id` as `groupId`, `user_id` as `userId`, `model_id` as `modelId`, `model`, `state`, `relevance_user_id` as `relevanceUserId`, `is_deleted` as `isDeleted`, `created_at` as `createdAt`, `updated_at` as `updatedAt` FROM bp_instance WHERE id = :id LIMIT 1 FOR UPDATE',
  GET_TASKS:
    'SELECT `id`, `group_id` as `groupId`, instance_id as `instanceId`, `process_id` as' +
    ' `processId`, `type`, `user_Id` as `userId`, `option`, `sequence`, `state`, `comment`, `cre' +
    'ated_at` as `createdAt`, `updated_at` as `updatedAt` FROM bp_task WHERE instance_' +
    'id = :instanceId AND type = :type FOR UPDATE',
  GET_PROCESSES:
    'SELECT `id`, `bp_id` as `bpId`, `group_id` as `groupId`, instance_id as `instanceId`, `parent_id` as ' +
    '`parentId`, `type`, `serial`, `approve_mode` as `approveMode`, `state`, `created' +
    '_at` as `createdAt`, `updated_at` as `updatedAt` FROM bp_process WHERE instance_id = :instanceId ' +
    'FOR UPDATE',
  GET_ENDEVENT:
    'SELECT `id`, `bp_id` as `bpId`, `group_id` as `groupId`, instance_id as `instanceId`, `parent_id` as ' +
    '`parentId`, `type`, `serial`, `approve_mode` as `approveMode`, `state`, `created' +
    '_at` as `createdAt`, `updated_at` as `updatedAt` FROM bp_process WHERE instance_id = :instanceId ' +
    'AND type = "EndEvent" FOR UPDATE',
  GET_REJECTEVENT:
    'SELECT `id`, `bp_id` as `bpId`, `group_id` as `groupId`, instance_id as `instanceId`, `parent_id` as ' +
    '`parentId`, `type`, `serial`, `approve_mode` as `approveMode`, `state`, `created' +
    '_at` as `createdAt`, `updated_at` as `updatedAt` FROM bp_process WHERE instance_id = :instanceId ' +
    'AND type = "RejectEvent" FOR UPDATE'
};
