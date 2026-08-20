CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(15) NOT NULL,
    description VARCHAR(500) NOT NULL,
    website_url VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_membership BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(30) NOT NULL,
    short_description VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    blog_name VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content VARCHAR(300) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_login VARCHAR(255) NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    dislikes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    status VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL,
    status VARCHAR(10) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);
