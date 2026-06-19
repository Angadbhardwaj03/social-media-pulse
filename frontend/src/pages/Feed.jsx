import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const PAGE_SIZE = 10;

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadPage = useCallback(async (pageNum) => {
    const { data } = await api.get("/api/posts", {
      params: { page: pageNum, limit: PAGE_SIZE },
    });
    return data;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadPage(1);
        setPosts(data.posts);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (err) {
        setError("Couldn't load the feed. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadPage]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await loadPage(nextPage);
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError("Couldn't load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <div className="feed-column">
          <CreatePost onPostCreated={handlePostCreated} />

          {loading && <p className="loading-state">Loading the feed...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && posts.length === 0 && !error && (
            <p className="empty-state">No posts yet — be the first to share something!</p>
          )}

          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {hasMore && (
            <div className="load-more-wrap">
              <button className="btn-primary-pulse" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more posts"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;
