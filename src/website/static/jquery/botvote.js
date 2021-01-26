$(document).ready(() => {
    const button = $("#voteButton")

    button.on("click", () => {
        button.addClass("disabled")

        toastr.options = {
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        $.post(window.location.href, undefined, (data) => {
            if (!data) return toastr.warning("Houve um erro ao validar este bot.")
            button.removeClass("disabled")

            if (!data.errorMessage) {
                toastr.success("Você votou neste bot com sucesso!")

                const votesCount = $("#votesCount")
                votesCount.text(parseInt(votesCount.text()) + 1)
            }else {
                toastr.warning(data.errorMessage)
            }
        })
    })
})
