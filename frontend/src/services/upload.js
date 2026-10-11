import api from "./api";

export const uploadFile =
  async (file) => {
    if (!file) {
      throw new Error(
        "Please select a file."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const uploadImage =
  async (file) => {
    if (!file) {
      throw new Error(
        "Please select an image."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await api.post(
        "/upload/image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const uploadAvatar =
  async (file) => {
    if (!file) {
      throw new Error(
        "Please select an avatar."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "avatar",
      file
    );

    const response =
      await api.post(
        "/upload/avatar",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export default {
  uploadFile,
  uploadImage,
  uploadAvatar,
};