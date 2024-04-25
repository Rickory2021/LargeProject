import React, { useState, useEffect } from 'react';
import ReadTable from './ReadTable';

const Table = ({ businessId }) => {
  const [posts, setPosts] = useState([]);

  const [addPost, setAddPost] = useState({
    itemName: ''
  });

  const [editPostId, setEditPostId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    itemName: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [modalInitialized, setModalInitialized] = useState(false);

  //Edit Data values
  const handleEditChange = input => e => {
    e.preventDefault();
    setEditFormData({ ...editFormData, [input]: e.target.value });
  };

  //edit modal data

  const handleEditPostForm = (e, post, index) => {
    e.preventDefault();

    setEditPostId(index);

    const formValues = {
      itemName: post.itemName
    };
    setEditFormData(formValues);
  };

  //Save form data
  const handleFormSave = async e => {
    e.preventDefault();

    const savePost = {
      itemName: editFormData.itemName
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-list/update-name?businessId=${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          findItemName: posts[editPostId].itemName,
          newItemName: editFormData.itemName
        })
      }
    );
    if (response.ok) {
      console.log();
    }

    const newPosts = [...posts];
    newPosts[editPostId] = savePost;

    setPosts(newPosts);
    setEditPostId(null);
  };

  //Delete data
  const handleDelete = async e => {
    e.preventDefault();

    const newPosts = [...posts];

    const response = await fetch(
      `${prcoess.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/delete?businessId=${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemName: posts[editPostId].itemName
        })
      }
    );

    newPosts.splice(editPostId, 1);

    setPosts(newPosts);
  };

  //Get from users
  const handleChange = input => e => {
    e.preventDefault();
    console.log(addPost);
    setAddPost({ ...addPost, [input]: e.target.value });
  };

  //Add data to table
  const handleAddItem = async e => {
    e.preventDefault();

    const newPost = {
      itemName: addPost.itemName
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-list/create?businessId=${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemName: addPost.itemName
        })
      }
    );
    const newPosts = [...posts, newPost];
    setPosts(newPosts);
    console.log(newPosts);
  };

  //search filter data

  function search() {
    return posts.filter(
      row => row.itemName.toLowerCase().indexOf(searchQuery) > -1
    );
  }

  //get data from api
  useEffect(() => {
    const readAll = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-list/read-all/?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const { fieldValues } = responseData;
        setPosts(fieldValues);
      } else {
        console.log('error');
      }
    };
    readAll();
  }, [businessId]);

  useEffect(() => {
    console.log(posts);
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    if (!modalInitialized && typeof window !== 'undefined') {
      import('bootstrap').then(bootstrap => {
        const Modal = bootstrap.Modal;
        const modalElement = document.getElementById('addModalForm');
        const modal = new Modal(modalElement);
        setModalInitialized(true);
      });
    }
  }, [modalInitialized]);

  return (
    <div>
      <div className="d-flex flex-row">
        <button
          type="button"
          className="me-3 btn btn-primary ml-auto d-block mb-2"
          data-bs-toggle="modal"
          data-bs-target="#addModalForm"
        >
          Add Data +
        </button>

        <form className="row g-3 ms-auto">
          <div className="col-auto">
            <input
              type="text"
              className="form-control ms-auto"
              placeholder="search data"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <table className="table table-bordered border-primary table-responsive">
        <thead>
          <tr>
            <th scope="col">Item Id</th>
            <th scope="col">Name</th>
            <th scope="col">Body</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <ReadTable
            posts={search(posts)}
            handleEditPostForm={handleEditPostForm}
          />
        </tbody>
      </table>

      {/*Add Modal */}
      <div
        className="modal fade"
        id="addModalForm"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Item
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddItem}>
                <div className="mb-3">
                  <label className="form-label">Item Id</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Item Id"
                    placeholder="Item Id"
                    required
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Item Name"
                    placeholder="Item Name"
                    required
                    onChange={handleChange('itemName')}
                  />
                </div>
                <div className="modal-footer d-block">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-warning float-end"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/*Edit Modal */}
      <div
        className="modal fade"
        id="editModalForm"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Row
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSave}>
                <div className="mb-3">
                  <label className="form-label">Item Id</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Item Id"
                    placeholder="Item Id"
                    required
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Item Name"
                    placeholder="Item Name"
                    required
                    value={editFormData.itemName}
                    onChange={handleEditChange('itemName')}
                  />
                </div>
                <div className="modal-footer d-block">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-success float-end"
                  >
                    Save Row
                  </button>
                  <button
                    onClick={handleDelete}
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-danger float-start"
                  >
                    Delete Row
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
