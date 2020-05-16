function submitForm() {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this Post!\n \nI'm Joking, your Post will be deleted but we will make sure there will be a copy of it !!!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          document.getElementById("form1").submit()
          setTimeout(deleted, 500)
        } else {
          swal("Your imaginary file is safe!");
        }
      });
}

function deleted() {
swal("Your file is deleted")
document.getElementById("form0").submit()
}

