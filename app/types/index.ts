// types/index.ts

export * from "./jobs";
export * from "./forms";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
