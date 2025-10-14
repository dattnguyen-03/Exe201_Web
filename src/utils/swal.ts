import Swal from 'sweetalert2';

// Success toast
export const showSuccess = (message: string, title: string = 'Thành công!') => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

// Error toast
export const showError = (message: string, title: string = 'Lỗi!') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

// Warning toast
export const showWarning = (message: string, title: string = 'Cảnh báo!') => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    timer: 2500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

// Info toast
export const showInfo = (message: string, title: string = 'Thông tin') => {
  Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

// Confirmation dialog
export const showConfirm = (message: string, title: string = 'Xác nhận') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  });
};
