/**
 * Created by Administrator on 2017/10/27.
 */
$(function(){
    var url='http://localhost:3000/api/imgList';
    $.ajax({
        url:url,
        type:'post',
        dataType:'json',
        data:{
            "val":$('#caseNav a').siblings('input').val()
        },
        success:function(data){
            $('#casePic').html('');
            createImg(data);
        },
        error:function(err){

        }
    });

    $('#caseNav a').on('click',function(){
        var valF=$(this).siblings('input').val();
        $('#casePic').html('');
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data:{
              "val":valF
            },
            success:function(data){
                createImg(data);
            },
            error:function(err){
                if(err) throw err;
            }
        });

    });
});

function createImg(data){
    var dataF=data.result;
    for(var x=0;x<dataF.length;x++){
        var inner=$("<div class='case fl'><a href='/case?id="+dataF[x]._id+"'><img src='/"+dataF[x].img+"' alt=''></a></div>");
        $('#casePic').append(inner);
    }
}