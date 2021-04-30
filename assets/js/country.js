var loader='<div class="loader w-100 h-100 d-flex justify-content-center align-items-center center-body"><i class="material-icons" style="font-size: 20em;">loop</i></div>';
var preMsg='<h3 class="text-muted" style="margin-top: 2vh;">Select a country to show stats.</h3>';

function tableRow(province, confirmed, recovered, deaths, active)
{
return '<tr><td>'+province+'</td><td class="text-danger">'+confirmed+'</td><td class="text-success">'+recovered+'</td><td class="text-muted">'+deaths+'</td><td class="text-warning">'+active+'</td></tr>';
}

function options(key, value)
{
    return '<option value="'+key+'">'+value+'</option>';
}

function thousands_separators(num)
{
var num_parts = num.toString().split(".");
num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return num_parts.join(".");
}

$(document).ready(function(){
$('.loader').hide();
$.getJSON('https://covid19.mathdro.id/api/countries', function(data){
        stats=data;        
        $.each(data['countries'], function(){
            $('.country-list select').append(options(this['iso2'], this['name']));
        });
    });
});

$(document).on('change', '.country-list select', function(){
    $('.loader').css('display', 'flex');
    var option=$(this).children(':selected').val();
    var country=$(this).children(':selected').text();
    if(option.length!=0)
    {
        $.getJSON('https://covid19.mathdro.id/api/countries/'+option, function(data){
            $('.main-content').load('dashboards/country_dashboard.html', function(){
                $('.country-name').html(country);
                var date = new Date(data['lastUpdate']);

                $('.confirmed-cases').text(thousands_separators(data['confirmed']['value']));
                $('.recoverd-cases').text(thousands_separators(data['recovered']['value']));
                $('.death-cases').text(thousands_separators(data['deaths']['value']));
                $('.last-update label').append(date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes());

                $.getJSON('https://covid19.mathdro.id/api/countries/'+option+'/confirmed', function(data){
                    var activeCases=0;
                    var province, confirmed, recovered, deaths, active;
                    province=confirmed=recovered=deaths=active='N/A';
                    $.each(data, function(){
                            $.each(this, function(key, value){
                            if(key=='provinceState' && value!=null)
                                province=value;
                            else if(key=='confirmed' && value!=null)
                                confirmed=value;
                            else if(key=='recovered' && value!=null)
                                recovered=value;
                            else if(key=='deaths' && value!=null)
                                deaths=value;
                            else if(key=='active' && value!=null)
                            {
                                active=value;
                                activeCases+=active;
                            }        
                        });
                        $('.table tbody').append(tableRow(province, confirmed, recovered, deaths, active));
                        $('.active-cases').text(thousands_separators(activeCases));
                    });
                    $('.loader').hide();
                });
            });
        });
    }
    else
        $('.main-content').html(preMsg);
});