import React from 'react';
import { useQuery } from 'react-query';

import Editor from './components/Editor';
import { BASE_POST_URL } from './routes';

interface Post {
  id: number;
  title: string;
}

async function getPosts(): Promise<Post[]> {
  const response = await fetch(BASE_POST_URL);
  const { posts = [] } = await response.json();
  return posts;
}

function App() {
  const [selectedPost, setSelectedPost] = React.useState<number | undefined>();
  const { data: posts, isLoading, isError } = useQuery('posts', getPosts);

  if (isLoading) {
    return <div className="container">Data is loading...</div>;
  }

  if (isError) {
    return <div className="container">Something went wrong...</div>;
  }

  if (!posts) {
    return (
      <div className="container">Something went wrong with the data...</div>
    );
  }

  return (
    <div className="container flex">
      <div>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <button onClick={() => setSelectedPost(post.id)}>
                {post.title}
              </button>
            </li>
          ))}
          <li key="create-post">
            <button onClick={() => setSelectedPost()}>Create new post</button>
          </li>
        </ul>
      </div>
      <Editor postId={selectedPost} />
    </div>
  );
}

export default App;
