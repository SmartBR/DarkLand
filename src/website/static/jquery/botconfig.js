$(document).ready(() => {
    function serializeFormJSON(form) {
        let o = {};
        let a = form.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

    $("#sendButton").on("click", (event) => {

        const form = $("form")
        const data = serializeFormJSON(form)
        const button = $("#sendButton")

        console.log(data)
        if (!data.id || !data.prefix || !data.library || !data.supportServer
            || !data.shortDescription || !data.description || !data.tags) return

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

        form.addClass("disabled")
        $.post(window.location.href, form.serialize(), (data) => {
            if (!data) return toastr.warning("Houve um erro ao validar este bot.")

            if (!data.errorMessage) {
                toastr.info(button.attr("aria-label"))

                setTimeout(() => {
                    form.removeClass("disabled")
                    window.location.href = "/dashboard"
                }, toastr.options.timeOut)
            }else {
                form.removeClass("disabled")
                toastr.warning(data.errorMessage)
            }
        })
    })
})