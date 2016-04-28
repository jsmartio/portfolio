import axios from 'axios';
import {
  ROOT_URL, POST_PATH, FETCH_POSTS, FETCH_POST, FETCH_NEW_POST,
  CREATE_POST, UPDATE_POST, DELETE_POST, TOGGLE_POST
} from '../constants';
import { fetchTags } from'./tags';
import { fetchItems } from'./items';
import { trimPost } from '../utilities';

export function fetchPosts() {
  const request = axios.get(`${ROOT_URL}${POST_PATH}`);
  return dispatch => {
    return request.then(
      response => dispatch(fetchPostsSuccess(response.data)),
      error => dispatch(fetchPostsFailure(error.data))
    )
  };
}

function fetchPostsSuccess(response) {
  return {
    type: FETCH_POSTS.SUCCESS,
    payload: response
  };
}

function fetchPostsFailure(error) {
  return {
    type: FETCH_POSTS.FAILURE,
    payload: error
  };
}



export function fetchPost(id) {
  const request = axios.get(`${ROOT_URL}${POST_PATH}/${id}`);
  return dispatch => {
    return request.then(
      response => dispatch(fetchPostSuccess(response.data)),
      error => dispatch(fetchPostFailure(error.data))
    ).then(response => {
      if (response.type === FETCH_POST.FAILURE) { return; }
      dispatch(fetchItems(response.payload.items));
      dispatch(fetchTags(response.payload.tags))
    })
  };
}

function fetchPostSuccess(response) {
  return {
    type: FETCH_POST.SUCCESS,
    payload: {
      post: response.post,
      items: response.items,
      tags: response.tags
    }
  };
}

function fetchPostFailure(error) {
  return {
    type: FETCH_POST.FAILURE,
    payload: error
  };
}

export function fetchNewPost() {
  const request = axios.get(`${ROOT_URL}${POST_PATH}/new`);
  return dispatch => {
    return request.then(
      response => dispatch(fetchNewPostSuccess(response.data)),
      error => dispatch(fetchNewPostFailure(error.data))
    ).then(response => {
      if (response.type === FETCH_NEW_POST.FAILURE) { return; }
      dispatch(fetchTags(response.payload.tags))
    })
  };
}

function fetchNewPostSuccess(response) {
  return {
    type: FETCH_NEW_POST.SUCCESS,
    payload: { tags: response.tags }
  };
}


function fetchNewPostFailure(error) {
  return {
    type: FETCH_NEW_POST.FAILURE,
    payload: error
  };
}


export function createPost(props) {
  const post = trimPost(props.post);
  let request;
  if (props.post.id) {
    request = axios.patch(`${ROOT_URL}${POST_PATH}/${post.id}`, { post });
  } else {
    request = axios.post(`${ROOT_URL}${POST_PATH}`, { post });
  }
  return dispatch => {
    dispatch(createPostRequest());
    return request.then(
      () => dispatch(createPostSuccess()),
      error => dispatch(createPostFailure(error.data))
    )
  };
}

export function createPostRequest() {
  return {
    type: CREATE_POST.REQUEST
  }
}

function createPostSuccess() {
  return {
    type: CREATE_POST.SUCCESS
  }
}

function createPostFailure(error) {
  return {
    type: CREATE_POST.FAILURE,
    payload: error
  }
}

export function updatePost(props) {
  const request = axios.patch(`${ROOT_URL}${POST_PATH}/${props.id}`, props);
  return dispatch => {
    return request.then(
      () => dispatch(updatePostSuccess()),
      error => dispatch(updatePostFailure(error.data))
    )
  };
}

function updatePostSuccess() {
  return {
    type: UPDATE_POST.SUCCESS
  }
}

function updatePostFailure(error) {
  return {
    type: UPDATE_POST.FAILURE,
    payload: error
  }
}

export function deletePost(id) {
  const request = axios.delete(`${ROOT_URL}${POST_PATH}/${id}`);
  return dispatch => {
    return request.then(
      () => dispatch(deletePostSuccess()),
      error => dispatch(deletePostFailure(error.data))
    )
  }
}

function deletePostSuccess() {
  return {
    type: DELETE_POST.SUCCESS
  }
}

function deletePostFailure(error) {
  return {
    type: DELETE_POST.FAILURE,
    payload: error
  }
}

export function togglePost(id) {
  const request = axios.patch(`${ROOT_URL}${POST_PATH}/${id}/acceptance`);
  return dispatch => {
    return request.then(
      () => dispatch(togglePostSuccess()),
      error => dispatch(togglePostFailure(error.data))
    )
  }
}

function togglePostSuccess() {
  return {
    type: TOGGLE_POST.SUCCESS
  }
}

function togglePostFailure(error) {
  return {
    type: TOGGLE_POST.FAILURE,
    payload: error
  }
}
