<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>
<body>
    <div class="container-fluid" id="container">
        <form-pyrus-slider class="mb-4"></form-pyrus-slider>
        <table-pyrus-slider></table-pyrus-slider>
    </div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="js/var.js"></script>
    <script src="js/toolbox.js"></script>
    <script src="js/__ENTITY.js"></script>
    <script src="js/pyrus.2.0.js"></script>
    <script>
        let p = new Pyrus({
            e: "slider",
            el: {
	            c: "container",
	            t: true,
	            f: true
	        },
	        method: {
	            post: function() {
	                this.element = "form-pyrus-client";
	                this.http = 'api/profesional/store';
	            }
	        }
        });
    </script>
</body>
</html>