  $(function(){
    $('#userbirth').datepicker({
      format: "dd-mm-yyyy",
      weekStart: 0,
      maxViewMode: 2,
      todayBtn: "linked",
      language: "id",
      autoclose: true,
      todayHighlight: true
    });
  });

  $('form').on('submit', function(e){
    e.preventDefault();
    validateForm();
  });

  function validateForm() {
    let ui = $('#userid').val().toString();
    let ub = $('#userbirth').val().toString();
    let uiRegex = /^\d{4,12}$/;
    let ubRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[1,2])-(19|20)\d{2}$/;
    let allValid = true;

    $('#userid').removeClass('is-invalid');
    $('#userbirth').removeClass('is-invalid');

    if(!uiRegex.test(ui)) {
      $('#userid').addClass('is-invalid');
      allValid = false;
    }
    if(!ubRegex.test(ub)) {
      $('#userbirth').addClass('is-invalid');
      allValid = false;
    }

    if(allValid) {
      submitForm();
    } else {
      let errMsg = '<ul><li>User ID antara 4 sampai 12 digit angka</li><li>Format tanggal lahir: hari-bulan-tahun</li></ul>';
      toastr.error(errMsg,'Isian Salah');
    }
  }

  function submitForm() {
    try {
      $('#loading').show();
      $("form :input").prop("disabled", true);

      google.script.run
      .withSuccessHandler(loginFormSuccess)
      .withFailureHandler(loginFormFailure)
      .doLogin($("#userid").val(),$("#userbirth").val());

    } catch (e) {
      toastr.error(e.message, e.name);
      $("form :input").prop("disabled", false);
      $("#loading").fadeOut();
    }
  }

  function loginFormSuccess(res){
    if(res.data == null) {
      if(res.msgError != ""){toastr.error(res.msgError, "Error");}
      if(res.msgInfo != ""){toastr.info(res.msgInfo, "Info");}
      $("form :input").prop("disabled", false);
      $("#loading").fadeOut();
    } else {
      google.script.run.withSuccessHandler(rslt => {
        $("form").trigger("reset");
        $("main").html(rslt);
        $("#loading").fadeOut();
      }).includeContent("Main");
    }    
  }

  function loginFormFailure(e) {
    toastr.error(e.message, e.name);
    $("form :input").prop("disabled", false);
    $("#loading").fadeOut();
  }