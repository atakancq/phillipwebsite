window.onload = function () {
 
    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetAbdBullettin`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#abdBullettin tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })

    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetAbdStockAnalysis`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#abdStockAnalysis tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })

    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetDailyBullettin`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#bist100 tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })

    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetCompanyReport`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#companyReport tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })

    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetLocalTechnicalAnalysis`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#localTechnicalAnalysis tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })

    $.ajax({
        url: `/WebServices/ClientServices.asmx/GetOtherReport`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { page: 1 },
        success: function (res) {
            var jObject = JSON.parse(res.d);

            var tableBody = $('#otherReport tbody');

            $.each(jObject, function (index, item) {
                var newRow = '<tr>';
                // Her bir sütun için
                newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                newRow += '</tr>';
                tableBody.append(newRow);
            });
        },
        error: (err) => {
            console.log(err.responseText);
        }
    })
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function loadContent(method, page, table) { 
        $.ajax({
            url: `/WebServices/ClientServices.asmx/${method}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: { page: page },
            success: function (res) {
                var jObject = JSON.parse(res.d);

                var tableBody = $(`${table} tbody`);

                $.each(jObject, function (index, item) {
                    var newRow = '<tr>';
                    // Her bir sütun için
                    newRow += `<td> <span>${item.Day}</span> ${item.Date} </td> <td> ${item.Title} </td> <td> <div class="pdf">Pdf</div> </td> <td> <a class="button" target="_blank" href="/Files/${item.Folder}/${item.ImageUrl}">${item.ButtonTxt}</a> </td>`
                    newRow += '</tr>';
                    tableBody.append(newRow);
                });
            },
            error: (err) => {
                console.log(err.responseText);
            }
        })
    }


    $('#bist100 tbody').scroll(debounce(function () {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) {
            var page = parseInt($("#bist100Page").val()) + 1;
            loadContent('GetDailyBullettin', page, '#bist100');
            $("#bist100Page").val(page);
        }

    }, 1000));


    $('#companyReport tbody').scroll(debounce(function () {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) { 
            var page = parseInt($("#companyReportPage").val()) + 1;
            loadContent('GetCompanyReport', page, '#companyReport');
            $("#companyReportPage").val(page);
        }
    }, 1000));

    $('#localTechnicalAnalysis tbody').scroll(debounce(function () {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) { 
            var page = parseInt($("#localTechnicalAnalysisPage").val()) + 1;
            loadContent('GetLocalTechnicalAnalysis', page, '#localTechnicalAnalysis');
            $("#localTechnicalAnalysisPage").val(page);
        }  
    }, 1000));

    $('#otherReport tbody').scroll(debounce(function () { 
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) { 
            var page = parseInt($("#otherReportPage").val()) + 1;
            loadContent('GetOtherReport', page, '#otherReport');
            $("#otherReportPage").val(page);
        }
         
    }, 1000));

    $('#abdBullettin tbody').scroll(debounce(function () {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) { 
            var page = parseInt($("#abdBullettinPage").val()) + 1;
            loadContent('GetAbdBullettin', page, '#abdBullettin');
            $("#abdBullettinPage").val(page);
        }
    }, 1000));

    //$('#abdBullettin tbody').scroll(debounce(function () {
    //    const scrollTop = $(this).scrollTop();
    //    const scrollHeight = $(this)[0].scrollHeight;
    //    const clientHeight = $(this).innerHeight();
    //    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    //    if (nearBottom) { 
    //        var page = parseInt($("#abdBullettinPage").val()) + 1;
    //        loadContent('GetAbdBullettin', page, '#abdBullettin');
    //        $("#abdBullettinPage").val(page);
    //    }
    //}, 1000));

    $('#abdStockAnalysis tbody').scroll(debounce(function () {
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const clientHeight = $(this).innerHeight();
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (nearBottom) { 
            var page = parseInt($("#abdStockAnalysisPage").val()) + 1;
            loadContent('GetAbdStockAnalysis', page, '#abdStockAnalysis');
            $("#abdStockAnalysisPage").val(page);
        }
    }, 1000));
};

