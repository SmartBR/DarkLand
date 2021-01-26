$(document).ready(() => {

    $("#deleteButton").on("click", (event) => {
        event.preventDefault()

        const form = $("form")
        const button = $("#deleteButton")
        form.addClass("disabled")

        toastr.options = {
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        $.ajax({
            type: "delete",
            url: window.location.href,
            data: form.serialize(),
            success: (data) => {
                if (!data) return toastr.warning("Houve um erro ao deletar este bot")

                if (!data.errorMessage) {
                    toastr.success(button.attr("aria-label"))

                    setTimeout(() => {
                        form.removeClass("disabled")
                        window.location.href = "/dashboard"
                    }, toastr.options.timeOut)
                }else {
                    form.removeClass("disabled")
                    toastr.warning(data.errorMessage)
                }
            }
        })
    })
})