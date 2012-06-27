$.fn.grid = function(opcoes){
  var defaults      = { 'maxheight':200,height:false,sem_registro:'Sem Registro',rolar_speed:500,width_rolagem:16,paginacao:false,registros:10}
  var configs       = $.extend(defaults,opcoes);
  var $tabela       = $(this);
  var $width        = $tabela.width();
  var $nova_largura = (parseInt($width) - configs.width_rolagem);

  $tabela.width($nova_largura).removeAttr('width').data('pg',1);

  var $div_header   = $('<div>').width($width).addClass('table-grid-header');
  var $div_body     = $('<div>').addClass('table-grid-body').width($width);
  var $table_header = $('<table>').width($nova_largura).appendTo($div_header);
  var $qtde_ths     = $tabela.find('thead tr th').length;

  $tabela.find('thead').clone().appendTo($table_header);
  $tabela.find('thead tr th').html('');
  $div_header.insertBefore($tabela);

  if(configs.height){
    $div_body.height(configs.height+'px');
  }else{
    $div_body.css({'max-height':configs.maxheight+'px'})
  }

  $tabela.wrap($div_body);

  //ACOES #####################
  var body  = $tabela.find('tbody');
  var ths   = $tabela.find('thead th');

  var _this = this;

  _this.atualiza = function(){
    var trs =  body.find('tr');
    if(!trs.length){
      var count = 0;
      ths.each(function(i,e){
        var tem_colspan = $(e).attr('colspan');
        if(tem_colspan){
          count += parseInt(tem_colspan);
        }else{
          count += 1;
        }
      });
      $(this).find('tbody').html('<tr class="linha_sem_registro"><td colspan="'+count+'">'+configs.sem_registro+'</td></tr>');
    }
    return this;
  };
  _this.montar_linha = function(d){
    if(typeof(d)=='string'){
      var dados_add = d;
    }else{
      if(ths.length == d.length){
        var dados_add = '<tr>';
        ths.each(function(i,e){
          var colspan = $(e).attr('colspan');
          colspan = colspan?' colspan="'+colspan+'"':'';
          var classe = $(e).attr('class');
          classe = classe?' class="'+classe+'"':'';
          var align = $(e).attr('align');
          align = align?' align="'+align+'"':'';
          dados_add += '<td'+colspan+classe+align+'>'+d[i]+'</td>';
        });
        dados_add += '</tr>';
      }else{
        alert('Problema ao adicionar! Quantidade de valores é diferente à quantidade de colunas na tabela.');
        return false;
      }
    }
    return dados_add;
  };
  _this.adicionar = function(d,l){
    var html_linha = _this.montar_linha(d);

    var trs =  body.find('tr:not(.linha_sem_registro)');
    if(trs.length){
      if(l=='inicio'){
        body.prepend(html_linha);
      }else{
        body.append(html_linha);
      }
    }else{
      body.html(html_linha);
    }
    _this.paginacao.atualizarPaginacao();
    return this;
  }
  _this.atualizar_registro = function(d,elem){
    var html_linha = _this.montar_linha(d);
    elem.closest('tr').replaceWith(html_linha);
  }
  _this.remover = function(i){
    i.closest('tr').remove();
    _this.atualiza();
    _this.paginacao.atualizarPaginacao();
    return this;
  }
  _this.limpar = function(){
    body.html('');
    _this.atualiza();
    _this.paginacao.atualizarPaginacao();
    return this;
  }
  _this.rolar = function(s){
    var $pos = s=='cima'?0:body.height();
    body.closest('div').animate({scrollTop:$pos},configs.rolar_speed);
    return this;
  }

  _this.registros = function(){
    return body.find('tr:not(.linha_sem_registro)').length;
  }

  var info_pg = $('<div>').addClass('info_pg');
  var pag = 0;
  var text_pg = $('<select>');

  _this.paginacao = {
    atualizarPaginacao:function(){
      if(configs.paginacao){
        var total_pg  = Math.ceil(_this.registros() / configs.registros);
        var pg       = $tabela.data('pg');
        if(pg==0 && total_pg > 0){
          pg = 1;
        }else if(pg > total_pg){
          pg = total_pg;
        }
        pag = total_pg;
        $tabela.data('pgs',pag);
        _this.paginacao.irpagina(pg);
        text_pg.html(_this.paginacao.opcoes_select(pg));
      }
    },
    irpagina: function(prox){
      var ate     =  prox * configs.registros;
      var inicia  = ate - configs.registros;
      $tabela.find('tbody tr:not(.linha_sem_registro)').hide().slice(inicia,ate).show();
      $tabela.data('pg',prox);
      text_pg.val(prox);
      info_pg.html(_this.paginacao.infopg());
    },
    infopg:function(){
      var pg = $tabela.data('pg');
      return 'Pagina: '+pg+' de '+pag;
    },
    paginar: function(acao){
      var pg = $tabela.data('pg');
      if(pg==0){ return false;}
      switch(acao){
        case "+":
          var prox = parseInt($tabela.data('pg'))+1;
          if(prox > $tabela.data('pgs')){ return false;}
        break;
        case "-":
          var prox = parseInt($tabela.data('pg'))-1;
          if(prox < 1){ return false;}
        break;
        case "++":
          var prox = $tabela.data('pgs');
        break;
        case "--":
          var prox = 1;
        break;
      }
      _this.paginacao.irpagina(prox);
    },
    opcoes_select:function(op){
      var reg = _this.registros();
      pag = Math.ceil(reg / configs.registros);
      var opcoes = '';
      for(i=1;i<=pag;i++){
        var selected = op==i?'selected':'';
        opcoes += '<option value="'+i+'"'+selected+'>'+i+'</option>';
      }
      return opcoes;
    },
    init:function(){
      var div = $tabela.parent('div');
      pag = Math.ceil(_this.registros() / configs.registros);
      pg  = (pag==0)?0:1;

      $tabela.data({'pgs':pag,'pg':pg}).find('tbody tr').hide().slice(0,configs.registros).show();

      var div_pag   = $('<div>').addClass('divPaginacao').width($nova_largura);
      var div_com   = $('<div>').addClass('div_comandos').appendTo(div_pag);
      var primeiro  = $('<div>').addClass('primeiro').attr('title','Primeira').click(function(){ _this.paginacao.paginar('--');}).appendTo(div_com);
      var anterior  = $('<div>').addClass('anterior').attr('title','Anterior').click(function(){ _this.paginacao.paginar('-');}).appendTo(div_com);
      var div_text  = $('<div>').addClass('select').appendTo(div_com);
      text_pg.css('width','70px').html(_this.paginacao.opcoes_select()).change(function(){ _this.paginacao.irpagina($(this).val())}).appendTo(div_text);
      var proximo   = $('<div>').addClass('proximo').attr('title','Proxima').click(function(){ _this.paginacao.paginar('+');}).appendTo(div_com);
      var ultimo    = $('<div>').addClass('ultimo').attr('title','Ultima').click(function(){ _this.paginacao.paginar('++');}).appendTo(div_com);
      info_pg.html('Pagina: '+pg+' '+'de '+pag).appendTo(div_pag);
      div_pag.insertAfter(div);
    }
  }

  if(configs.paginacao){
    _this.paginacao.init();
  }

  //ACOES FIM #####################
  _this.atualiza();
  return _this;
}