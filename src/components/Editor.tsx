import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useQuery, useMutation } from 'react-query';

import { BASE_POST_URL, getPostByIdUrl } from '../routes';

interface Post {
  id: number;
  title?: string;
  content?: string;
}

interface CreatePost {
  title: string;
  content?: string;
  category: string;
}

async function getPostById(postId: number): Promise<Post> {
  const url = getPostByIdUrl(postId);
  const response = await fetch(url);
  return await response.json();
}

async function updatePostById(updatedPost: Post) {
  const url = getPostByIdUrl(updatedPost.id);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: updatedPost.title,
      content: updatedPost.content,
    }),
  });
  return await response.json();
}

async function createPost(post: CreatePost) {
  const response = await fetch(BASE_POST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  return await response.json();
}

function Editor({ postId }: { postId: number | undefined }) {
  if (postId !== undefined) {
    return <EditPostEditor postId={postId} />;
  }

  const [title, setTitle] = React.useState<string>('');
  const [text, setText] = React.useState<string | undefined>('');
  const [category, setCategory] = React.useState<string>('');

  const mutation = useMutation(createPost);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await mutation.mutate({ category, title, content: text });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          className="w-full py-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <MDEditor value={text} onChange={setText} />
        <input
          className="w-full py-5"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

function EditPostEditor({ postId }: { postId: number }) {
  const [title, setTitle] = React.useState<string | undefined>('');
  const [text, setText] = React.useState<string | undefined>('');
  const { isLoading, isError } = useQuery(
    ['posts', postId],
    () => getPostById(postId),
    {
      onSuccess: (data) => {
        setTitle(data.title);
        setText(data.content);
      },
    }
  );
  const mutation = useMutation(updatePostById, {
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutation.mutate({ id: postId, content: text, title });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          className="w-full py-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <MDEditor value={text} onChange={setText} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Editor;
