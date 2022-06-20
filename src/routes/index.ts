export const BASE_POST_URL = 'https://localhost:3000/api/v1/posts';

export function getPostByIdUrl(postId: number): string {
  return `${BASE_POST_URL}/${postId}`;
}
