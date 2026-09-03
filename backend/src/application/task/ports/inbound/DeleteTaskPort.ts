export interface DeleteTaskPort {
  execute(id: string, ownerId: string): Promise<void>;
}
