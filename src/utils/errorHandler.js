export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: 'No response from server. Please check your connection.',
      status: null,
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
    };
  }
};

export const showErrorToast = (error) => {
  const errorInfo = handleApiError(error);
  console.error('Error:', errorInfo);
  return errorInfo.message;
};
