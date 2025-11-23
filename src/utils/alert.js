import Swal from "sweetalert2";

export const successAlert = (msg) => {
  return Swal.fire({
    icon: "success",
    title: msg,
    timer: 1800,
    showConfirmButton: false,
  });
};

export const errorAlert = (msg) => {
  return Swal.fire({
    icon: "error",
    title: msg,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const warningAlert = (msg) => {
  return Swal.fire({
    icon: "warning",
    title: msg,
    timer: 1800,
    showConfirmButton: false,
  });
};

export const confirmDelete = () => {
  return Swal.fire({
    title: "هل أنت متأكد؟",
    text: "لن تستطيع التراجع عن الحذف!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#12b1d1",
    cancelButtonColor: "#d33",
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
  });
};
