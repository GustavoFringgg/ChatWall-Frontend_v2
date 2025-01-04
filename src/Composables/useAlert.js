import Swal from 'sweetalert2'

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
  return {
    showAlert,
  }
}
