$(document).ready(() => {

    toastr.options = {
        "closeButton": true,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    const approveModal = $("#approveModal")
    const approveButton = $("#approveButton")

    const reproveModal = $("#reproveModal")
    const reproveButton = $("#reproveButton")

    action(approveButton, approveModal, "approve", "Bot aprovado com sucesso!")
    action(reproveButton, reproveModal, "reprove", "Bot reprovado com sucesso!")

    function action(button, modal, post, message) {
        button.on("click", () => {
            const url = window.location.href

            modal.hide()
            toastr.success(message)

            $.ajax({
                type: "post",
                url: `${url}/${post}`,
                data: $("form").serialize()
            })

            setTimeout(() => {
                window.location.href = "/admin"
            }, 3000)
        })
    }
})