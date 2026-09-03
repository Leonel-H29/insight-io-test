export interface DeleteTaskPort {
  execute(id: string): Promise<void>;
}
