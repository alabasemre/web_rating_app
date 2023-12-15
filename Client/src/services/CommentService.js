const BASE_URL = 'http://localhost:5174/api/comment';

async function addComment(comment, token) {
    if (token === null || comment == null) {
        return;
    }

    const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
            productid: comment.productid,
            commenttext: comment.commenttext,
            score: comment.score,
        }),
    });

    if (response.ok) {
        const newComment = await response.json();
        return newComment;
    }
}

export { addComment };
