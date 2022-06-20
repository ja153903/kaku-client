import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useQuery } from 'react-query';

interface Post {
  id: number;
  title: string;
  content: string;
}

async function getPostById(postId: number): Promise<Post> {
  const response = await fetch(`https://kaku.be/api/v1/posts/${postId}`);
  return await response.json();
}

async function updatePostById(postId: number, updatedPost: Omit<Post, 'id'>) {
  const response = await fetch(`https://kaku.be/api/v1/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });
  return await response.json();
}

function Editor({ postId }: { postId: number | undefined }) {
  if (postId === undefined) {
    return null;
  }

  const [title, setTitle] = React.useState<string | undefined>('');
  const [text, setText] = React.useState<string | undefined>('');
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery(['posts', postId], () => getPostById(postId), {
    onSuccess: (data) => {
      setTitle(data.title);
      setText(data.content);
    },
  });

  if (isLoading) {
    return <div>Data is loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong loading post...</div>;
  }

  return (
    <div className="container">
      <input
        className="w-full py-5"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <MDEditor value={text} onChange={setText} />
    </div>
  );
}

export default Editor;
