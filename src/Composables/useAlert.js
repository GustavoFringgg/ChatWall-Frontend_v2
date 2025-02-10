import Swal from 'sweetalert2/dist/sweetalert2.js'

export function useAlert() {
  const showAlert = (title, icon, time = 1000) => {
    return Swal.fire({
      position: 'top',
      title: title,
      icon: icon,
      timer: time,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true,
    })
  }
  const showDeleteAlert = () => {
    return Swal.fire({
      title: '要刪除此貼文嗎?',
      text: '刪除後沒辦法回復!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  } //promise

  return {
    showAlert,
    showDeleteAlert,
  }
}
