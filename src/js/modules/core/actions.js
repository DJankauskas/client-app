import axios from "axios";
import * as t from "./actionTypes";
import { STUY_SPEC_API_URL, STUY_SPEC_API_HEADERS } from "../../constants";

export const refreshWindowDimensions = () => ({
  type: t.REFRESH_WINDOW_DIMENSIONS,
  payload: {},
});

export const openSidebar = () => ({
  type: t.OPEN_SIDEBAR,
});
export const closeSidebar = () => ({
  type: t.CLOSE_SIDEBAR,
});

export const openLightbox = () => ({
  type: t.OPEN_LIGHTBOX,
});
export const closeLightbox = () => ({
  type: t.CLOSE_LIGHTBOX,
});

export const fetchAllData = () => {
  const loadingIcon = document.querySelector(".loading");
  console.log(STUY_SPEC_API_URL)
  return dispatch => {
    dispatch({ type: t.FETCH_INIT_DATA_PENDING });
    axios
      .get(`${STUY_SPEC_API_URL}/init`, STUY_SPEC_API_HEADERS)
      .then(response => {
        validateSlices(response.data);
        loadingIcon.parentNode.removeChild(loadingIcon);
        dispatch({ type: t.FETCH_INIT_DATA_FULFILLED, payload: response.data });
      })
      .catch(err => {
        loadingIcon.parentNode.removeChild(loadingIcon);
        dispatch({
          type: t.FETCH_INIT_DATA_REJECTED,
          payload: err,
        });
      });
  };
};

const sliceNames = [
  "articles",
  "sections",
  // 'comments', We don't care if zero comments exist.
  "media",
  "users",
  "roles",
  "profiles",
  "authorships",
  "outquotes",
];

const validateSlices = data => {
  for (sliceName of sliceNames) {
    if (!(sliceName in data)) {
      throw sliceName + " not in initial data.";
    }
    if (data[sliceName].length === 0) {
      throw `Zero ${sliceName} received in initial data.`;
    }
  }
};
