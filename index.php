<html>
  <head>
    <link href="css/jquery.grid.css" type="text/css" rel="stylesheet">
    <script src="jquery.js"></script>
    <script src="jquery.grid.js"></script>
    <script>
      $(document).ready(function(){
        var tabela = $('#tabela').grid({paginacao:true,height:242});
        tabela.find('tbody').delegate('a.excluir','click',function(){
          tabela.remover($(this));
        });
        $('#add').click(function(){
          tabela.adicionar(['Pedro','Cavalheiro',1,30,'1250,25','1.448,25','<a class=\"excluir\">X</a>']);
        });
        $('#limpar').click(function(){
          tabela.limpar();
        });

        $('#tabela2').grid({paginacao:false,height:270});
      });
    </script>
  </head>
  <body>
    <input type="button" id="add" value="adicionar">
    <input type="button" id="limpar" value="limpar">
    <table id="tabela" width="1200">
      <thead>
      <tr>
        <th width="100" align="left">Nome</th>
        <th width="150" align="left">Sobrenome</th>
        <th width="60" align="left" width="225">Cont</th>
        <th width="65">Idade</th>
        <th width="70" align="right">Valor</th>
        <th width="70" align="right">Valor 2</th>
        <th width="20" align="center">#</th>
      </tr>
      </thead>
      <tbody>
        <?
        for($i=1;$i<=1000;$i++){
          echo "<tr>
                  <td>Fernandoa $i</td>
                  <td>Wobeto</td>
                  <td>$i</td>
                  <td>30</td>
                  <td align=\"right\">$i,50</td>
                  <td align=\"right\">$i,27</td>
                  <td align=\"center\"><a class=\"excluir\">X</a></td>
                </tr>";

        }
        ?>
      </tbody>
    </table>
    <br>
    <br>
    <table id="tabela2" width="1600">
      <thead>
      <tr>
        <th align="left">Nome</th>
        <th align="left">Sobrenome</th>
        <th width="60" align="right">Cont</th>
        <th width="65">Idade</th>
        <th width="30" align="right">I</th>
        <th width="30" align="right">I</th>
        <th width="30" align="right">I</th>
        <th width="30" align="right">I</th>
        <th width="30" align="right">I</th>
        <th>Cidade</th>
        <th width="60" align="center">Estado</th>
        <th width="70" align="right">Valor</th>
        <th width="70" align="right">Valor 2</th>
        <th width="20" align="center">#</th>
      </tr>
      </thead>
      <tbody>
        <?
        for($i=1;$i<=50;$i++){
          echo "<tr>
                  <td>Marcelo $i</td>
                  <td>Ablubla</td>
                  <td align=\"right\">$i</td>
                  <td>30</td>
                  <td align=\"right\">$i</td>
                  <td align=\"right\">$i</td>
                  <td align=\"right\">$i</td>
                  <td align=\"right\">$i</td>
                  <td align=\"right\">$i</td>
                  <td>Estância Velha</td>
                  <td align=\"center\">RS</td>
                  <td align=\"right\">$i,50</td>
                  <td align=\"right\">$i,27</td>
                  <td align=\"center\">X</td>
                </tr>";

        }
        ?>
      </tbody>
    </table>
  </body>
</html>