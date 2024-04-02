import React from 'react';

const ReadTable = ({ posts, handleEditPostForm }) => {
  return (
    <>
      {posts.map((post, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{post.itemName}</td>
          <td>Random stuff for later</td>
          <td>
            <button
              type="button"
              className="me-3 btn btn-primary ml-auto d-block mb-2"
              data-bs-toggle="modal"
              data-bs-target="#editModalForm"
              onClick={e => handleEditPostForm(e, post, index)}
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ReadTable;
