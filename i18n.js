(function () {
  var translations = {
    gl: {
      htmlLang: 'gl',
      pageTitle: 'Lumes en Galicia — StoryMap',
      languageSelectorLabel: 'Escoller idioma',
      topbarTitle: 'Por que arden os nosos montes?',
      heroHeadline: 'Por que arden os nosos montes?',
      heroKicker: 'Un verán extremo, moita vexetación acumulada e unha paisaxe que xa non se comporta como antes.<span class="mobile-break"></span> Co apoio dos datos tentaremos comprender por que os incendios seguen golpeando con tanta forza o noroeste peninsular.',
      scrollHint: 'Despraza para explorar',
      heroPhotoCredit: 'FOTO: Pedro Armestre',
      mapSource: 'Fonte: forest-fire.emergency.copernicus.eu/',
      sliderCaption: 'Fonte: Comparador do Plan Nacional de Ortofotografía Aérea',
      categoryAriaLabel: 'Selecciona unha categoría de información',
      categoryDefault: 'Fai a túa selección no menú superior.',
      categoryTabs: {
        geologia: 'Xeoloxía',
        vegetacion: 'Vexetación',
        clima: 'Clima',
        geografia: 'Xeografía'
      },
      climateAlts: {
        larouco: 'Clima en Larouco',
        fases: 'Fases do clima'
      },
      heroFinal: {
        headline: 'Temos que aprender a convivir co lume, pero aínda podemos facer máis…',
        paragraphs: [
          'Non existe unha solución máxica. Hai que aceptar que o lume continuará formando parte da nosa realidade, e máis aínda co cambio climático. A prioridade é reducir o seu impacto e adaptarnos, antes que buscar culpables fáciles.',
          'A resposta é complexa e require visión a longo prazo: máis xestión da paisaxe, máis pastoreo adaptativo, prevención activa na interface urbano-forestal, educación para convivir co lume… e moito máis.',
          'O lume é un fenómeno natural: con frecuencia negativo e tráxico para as persoas, os bens e os modos de vida, pero tamén positivo para o rexuvenecemento e a dinámica dos ecosistemas. Comprendelo é clave para aprender a convivir con el.'
        ],
        photoCredit: 'FOTO: Pedro Armestre'
      },
      categoryContent: {
        geologia: {
          title: 'Xeoloxía',
          text: '<h2>Xeoloxía</h2>Nesta capa podemos ver a <strong>litoloxía</strong> do sueste de Galicia. A maior parte do territorio está formada por <strong>rochas metamórficas</strong> e <strong>graníticas</strong>, que dan lugar a <strong>solos ácidos</strong>.<br>Eses solos favorecen comunidades vexetais máis <strong>inflamables</strong> pola composición dos seus tecidos.<br><br><strong>Lenda:</strong><br><span style="color: #e7298a;">■</span> DEPÓSITOS DETRÍTICOS CUATERNARIOS<br><span style="color: #1b9e77;">■</span> DEPÓSITOS DETRÍTICOS TERCIARIOS<br><span style="color: #e6ab02;">■</span> DEPÓSITOS PLIOCUATERNARIOS<br><span style="color: #8cf0b7;">■</span> ROCHAS CARBONATADAS<br><span style="color: #51e723;">■</span> ROCHAS FILONIANAS<br><span style="color: #d95f02;">■</span> ROCHAS GRANÍTICAS<br><span style="color: #7570b3;">■</span> ROCHAS METAMÓRFICAS<br><br><div style="text-align: right; font-style: italic; color: #666; font-size: 12px;">Fonte: SERGAS</div>'
        },
        vegetacion: {
          title: 'Vexetación',
          text: '<h2>Vexetación</h2>Esta capa amosa os <strong>usos do solo</strong> de Galicia agrupados en oito clases divulgativas. A paisaxe galega é un mosaico dominado polo <strong>agrosistema</strong>, cunha pegada enorme de <strong>eucaliptal</strong> e <strong>mato</strong> no monte combustible, e unha presenza menor de <strong>frondosas autóctonas</strong>. Esta distribución é clave para entender a cantidade e a continuidade do <strong>combustible vexetal</strong>, factores decisivos na propagación dos incendios.<br><br><strong>Lenda:</strong><br><span style="color: #2e7d32;">■</span> Frondosas autóctonas<br><span style="color: #c2185b;">■</span> Eucalipto<br><span style="color: #5d4037;">■</span> Piñeiro / coníferas<br><span style="color: #fbc02d;">■</span> Mato<br><span style="color: #7cb342;">■</span> Mestura arbórea<br><span style="color: #fb8c00;">■</span> Agrícola e mosaicos<br><span style="color: #616161;">■</span> Urbano e artificial<br><span style="color: #0288d1;">■</span> Auga e outros<br><br><div style="text-align: right; font-style: italic; color: #666; font-size: 12px;">Fonte: Mapa de Usos do Solo, IET — Xunta de Galicia, escala 1:250.000 (2011)</div>'
        },
        clima: {
          title: 'Clima',
          text: '<h2>Clima</h2>Este gráfico amosa as <strong>precipitacións</strong>, a <strong>temperatura</strong> e o <strong>NDVI</strong> (un índice que mide a actividade da vexetación) rexistrados na estación de <strong>Larouco</strong>, na zona do incendio.<br><br>Obsérvanse dúas fases ben definidas:<br><br>🌧 <strong>Estación chuviosa</strong>: abundantes choivas e temperaturas moderadas reducen o risco de incendio e favorecen unha alta produtividade vexetal, acumulando biomasa.<br><br>☀️ <strong>Estación seca</strong>: co aumento prolongado das temperaturas apréciase unha caída do <strong>NDVI</strong> —a vexetación sécase—, a reserva de combustible é elevada e o risco disprárase.<br><br>Este patrón encaixa con <strong>climas mediterráneos húmidos</strong>, <strong>tropicais estacionais</strong> ou certos <strong>climas continentais</strong>, onde o lume forma parte da dinámica natural do ecosistema.'
        },
        geografia: {
          title: 'Xeografía',
          text: '<h2>Xeografía</h2>No mapa apréciase un <strong>relevo montañoso e moi recortado</strong>, con vales profundos e ladeiras escarpadas que caracterizan boa parte do interior de Galicia.<br><br>A <strong>xeografía</strong> inflúe de maneira decisiva no comportamento do lume:<br><br><strong>Relevo abrupto</strong>: as pendentes dificultan o acceso dos equipos de extinción e facilitan que as lapas ascendan con rapidez.<br><br><strong>Ventos irregulares e fortes</strong>: en zonas montañosas as correntes de aire cambian de dirección con facilidade, o que pode desviar bruscamente o avance do incendio.'
        }
      },
      chapters: {
        'incendios-2025': {
          title: '',
          description: `
            <h2>Un verán para <s style="color: rgba(255, 255, 255, 0.64);">esquecer</s> <strong>reaccionar</strong></h2>
            Os incendios do verán de <strong>2025</strong> quedarán gravados na <strong>historia de Galicia</strong>.<br>
            Nunca antes se rexistrara unha <strong>superficie tan extensa arrasada</strong> polas chamas.<br>
            O incendio de <strong>Larouco–Seadur</strong>, con máis de <strong>31.700 hectáreas</strong> (317 km²), foi o <strong>maior visto nunca</strong> na nosa comunidade.<br><br>
            Para comprender a súa magnitude convén lembrar a diferenza entre un <strong>incendio forestal</strong> e un <strong>gran incendio forestal (GIF)</strong>: o primeiro pode afectar só a unhas poucas hectáreas, mentres que o segundo supera as <strong>500 hectáreas</strong>. O lume de Larouco multiplicou por máis de <strong>60</strong> ese limiar.<br><br>
            Mais os números poden enganarnos e afastarnos do problema: como dimensionar algo tan enorme? Un xeito é comparar o incendio cun entorno que coñezamos, como <strong>as nosas cidades</strong>.<br><br>
            Para entender mellor a súa magnitude, o seguinte gráfico compara a área queimada coa superficie municipal de varias cidades coñecidas.<br><br>
            <div id="grafica-comparador" class="grafica-host" style="margin-top: 12px;"></div>
          `
        },
        'pegada-lume': {
          title: '',
          description: `
            <h2>A pegada do lume, vista dende o espazo</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-dnbr" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Para medir o que deixou atrás o lume recorremos ao <strong>dNBR</strong> (differential Normalized Burn Ratio), unha métrica estándar en teledetección post-lume que combina as bandas do infravermello próximo e do SWIR2 de Sentinel-2. A diferenza entre unha imaxe previa (24 xullo) e outra posterior (10 outubro) descobre, píxel a píxel, onde se queimou a vexetación e con que intensidade.<br><br>
Reclasificando eses valores cos limiares <strong>Key &amp; Benson 2006</strong>, o bbox do lume reparte as súas 24.451 hectáreas queimadas así: <strong>13.335 ha de severidade baixa</strong>, <strong>5.395 de moderada-baixa</strong>, <strong>5.265 de moderada-alta</strong> e <strong>457 ha de severidade alta</strong> — os focos de vexetación arrasada total, onde a rexeneración natural será máis lenta.<br><br>
É unha análise reproducible: dúas escenas Sentinel-2 abertas, dúas bandas, unha resta. O que para un equipo de modelización significa puntos quentes para validar simulacións de propagación.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Para medir o que deixou atrás o lume recorremos ao <strong>dNBR</strong> (differential Normalized Burn Ratio), unha métrica estándar en teledetección post-lume que combina as bandas do infravermello próximo e do SWIR2 de Sentinel-2. A diferenza entre unha imaxe previa (24 xullo) e outra posterior (10 outubro) descobre, píxel a píxel, onde se queimou a vexetación e con que intensidade.<br><br>
Reclasificando eses valores cos limiares <strong>Key &amp; Benson 2006</strong>, o bbox do lume reparte as súas <strong>24.451 ha queimadas</strong> así:<br>
&nbsp;&nbsp;13.335 ha — severidade baixa<br>
&nbsp;&nbsp;5.395 ha — moderada-baixa<br>
&nbsp;&nbsp;5.265 ha — moderada-alta<br>
&nbsp;&nbsp;457 ha — severidade alta<br><br>
A concentración de severidade alta marca os focos onde a rexeneración natural será máis lenta. É unha análise reproducible: dúas escenas Sentinel-2 abertas, dúas bandas, unha resta. Para un equipo de modelización son puntos quentes para validar simulacións de propagación.
                        </p>
                    </div>
                </div>
          `
        },
        'tendencia-aumento': {
          title: '',
          description: `
            <h2>Unha tendencia en <strong>aumento</strong></h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-tendencia" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  Falar de incendios en Galicia depende moito de quen os conte.<br><br>
  Se miramos os datos do satélite (<strong>EFFIS</strong>), os grandes lumes saltan á vista, pero a maioría dos pequenos escápansenos: só recolle os que deixan unha pegada suficientemente visible dende o espazo.<br><br>
  O rexistro <strong>oficial da Xunta</strong> recólleos todos. E aí os números cambian de orde: en anos recentes hai máis de <strong>1.000 incendios ao ano</strong>, non as poucas decenas que ve o satélite.<br><br>
  Os picos seguen estando en <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong>, pero <strong>2025</strong> rompe todas as escalas: preto de <strong>120.000 hectáreas</strong> arrasadas nunha soa tempada.<br><br>
  Non é só que ardan máis hectáreas: é que os grandes incendios pesan cada vez máis dentro do total.
                          </p>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        
                        <div id="grafica-mapa-tendencia" class="grafica-host"></div>
                        <br class="only-mobile"><br class="only-mobile">
                        <div class="mobile-expl">
                          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  O mapa permite visualizar de forma interactiva a distribución dos <strong>incendios forestais</strong> en Galicia entre 2016 e 2025.<br><br>
  Os círculos representan a magnitude dos incendios e a súa localización, mentres que a liña inferior mostra a evolución anual.<br><br>
  A maior concentración mantense no sur da comunidade, especialmente na provincia de <strong>Ourense</strong>, que actúa como epicentro recorrente.<br><br>
  Nos anos <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> os focos multiplícanse, e en <strong>2025</strong> a superficie queimada acada valores excepcionais.<br><br>
  Os datos evidencian un patrón de recorrencia: os incendios tenden a repetirse nas mesmas zonas, cunha intensidade cada vez maior.<br><br>
  Máis que episodios illados, reflicten un proceso sostido que amplifica o seu impacto co paso do tempo.
                          </p>
                        </div>
                    </div>
                    
                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.72; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  Falar de incendios en Galicia depende moito de quen os conte.<br><br>
  Se miramos os datos do satélite (<strong>EFFIS</strong>), os grandes lumes saltan á vista, pero a maioría dos pequenos escápansenos: só recolle os que deixan unha pegada suficientemente visible dende o espazo.<br><br>
  O rexistro <strong>oficial da Xunta</strong> recólleos todos. E aí os números cambian de orde: en anos recentes hai máis de <strong>1.000 incendios ao ano</strong>, non as poucas decenas que ve o satélite.<br><br>
  Os picos seguen estando en <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong>, pero <strong>2025</strong> rompe todas as escalas: preto de <strong>120.000 hectáreas</strong> arrasadas nunha soa tempada.<br><br>
  Non é só que ardan máis hectáreas: é que os grandes incendios pesan cada vez máis dentro do total.
                        </p>
                        
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.63;">
  O mapa permite visualizar de forma interactiva a distribución dos <strong>incendios forestais</strong> en Galicia entre 2016 e 2025.<br><br>
  Os círculos representan a magnitude dos incendios e a súa localización, mentres que a liña inferior mostra a evolución anual.<br><br>
  A maior concentración mantense no sur da comunidade, especialmente na provincia de <strong>Ourense</strong>, que actúa como epicentro recorrente.<br><br>
  Nos anos <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> os focos multiplícanse, e en <strong>2025</strong> a superficie queimada acada valores excepcionais.<br><br>
  Os datos evidencian un patrón de recorrencia: os incendios tenden a repetirse nas mesmas zonas, cunha intensidade cada vez maior.<br><br>
  Máis que episodios illados, reflicten un proceso sostido que amplifica o seu impacto co paso do tempo.
                        </p>
                    </div>
                </div>
          `
        },
        'galicia-noroeste': {
          title: '',
          description: `
            <h2>Por que Galicia e o Noroeste?</h2>
            <p>Escolle unha das categorías para explorar os factores que explican por que esta rexión é especialmente vulnerable aos incendios forestais.</p>
            <div id="category-mobile-slot" class="category-mobile-slot"></div>
            <div id="layer-explanation" class="layer-explanation">
                <h3 id="layer-title" style="margin: 0 0 12px 0; color: #F44E11; display: none;"></h3>
                <p id="layer-description" style="margin: 0; line-height: 1.6;">Fai a túa selección no menú superior.</p>
            </div>
            <div id="climate-inline-container" class="climate-inline" style="display:none;">
                <img src="assets/Larouco_Clima.png" alt="Clima en Larouco" class="climate-inline-large" />
                <img src="assets/Fases_Clima.png" alt="Fases do clima" class="climate-inline-small" />
            </div>
          `
        },
        'tendencia-comparativas': {
          title: '',
          description: `
            <h2>As causas detrás do lume</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-causas" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante máis de cinco décadas, os incendios en Ourense tiveron un denominador común: a maioría foron provocados.<br><br>
Sobre o conxunto dos <strong>81.643 partes oficiais</strong> rexistrados entre <strong>1968 e 2022</strong>, case <strong>8 de cada 10</strong> son intencionados; o resto repártese entre causa descoñecida (14%), neglixencias (4%), reproducións e raio (apenas un 1,5% cada un).<br><br>
Cando se mira <strong>dentro do grupo dos intencionados</strong>, o patrón vólvese máis nítido: arredor do <strong>43%</strong> son <strong>queimas agrícolas ou gandeiras</strong> que se descontrolan, moi ligadas ao uso tradicional do lume para limpar ou preparar terreos. Caza, vandalismo, piromanía ou vinganzas suman porcentaxes moito menores.<br><br>
E aínda así, case a metade dos partes intencionados non chegan a ter unha motivación recoñecida: investigar este tipo de incendios é complicado.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante máis de cinco décadas, os incendios en Ourense tiveron un denominador común: a maioría foron provocados.<br><br>
Sobre o conxunto dos <strong>81.643 partes oficiais</strong> rexistrados entre <strong>1968 e 2022</strong>, case <strong>8 de cada 10</strong> son intencionados; o resto repártese entre causa descoñecida (14%), neglixencias (4%), reproducións e raio (apenas un 1,5% cada un).<br><br>
Cando se mira <strong>dentro do grupo dos intencionados</strong>, o patrón vólvese máis nítido: arredor do <strong>43%</strong> son <strong>queimas agrícolas ou gandeiras</strong> que se descontrolan, moi ligadas ao uso tradicional do lume para limpar ou preparar terreos. Caza, vandalismo, piromanía ou vinganzas suman porcentaxes moito menores.<br><br>
E aínda así, case a metade dos partes intencionados non chegan a ter unha motivación recoñecida: investigar este tipo de incendios é complicado.
                        </p>
                    </div>
                </div>
          `
        },
        'propiedade-monte': {
          title: '',
          description: `
            <h2>De quén son os montes que arden</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-propiedade" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
A propiedade do monte galego é unha rareza no contexto estatal. Preto dun terzo do territorio forestal está organizado como <strong>monte veciñal en man común</strong> (MVMC): terras xestionadas colectivamente polos veciños dunha parroquia desde antes das desamortizacións, devoltas ás súas comunidades pola Lei 13/1989.<br><br>
Os <strong>3.290 montes veciñais</strong> clasificados suman <strong>660.000 hectáreas</strong> — un <strong>22,3%</strong> do territorio galego, case todas concentradas en Ourense e Lugo.<br><br>
Cando se cruza o rexistro MVMC cos <strong>1.475 incendios</strong> que documentou PrazaGal en 2025, o contraste é claro: <strong>o 39% das hectáreas estimadas queimadas</strong> cae sobre MVMC, case o dobre do peso que lles correspondería por superficie. Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) ou Castro de Escuadro (74%) están entre as parroquias máis castigadas — e son xustamente as de maior concentración veciñal.<br><br>
A explicación ten pouco que ver co réxime xurídico en si: as comunidades de montes foron historicamente un dos poucos axentes que aínda fan xestión activa do monte. A correlación fala, sobre todo, de <strong>onde queda o monte</strong>: nas parroquias rurais do interior ourensán, baleiradas polo éxodo, onde a propiedade colectiva sobrevive porque o minifundio privado se abandonou.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
A propiedade do monte galego é unha rareza no contexto estatal. Preto dun terzo do territorio forestal está organizado como <strong>monte veciñal en man común</strong> (MVMC): terras xestionadas colectivamente polos veciños dunha parroquia desde antes das desamortizacións, devoltas ás súas comunidades pola Lei 13/1989.<br><br>
Os <strong>3.290 montes veciñais</strong> clasificados suman <strong>660.000 hectáreas</strong> — un <strong>22,3%</strong> do territorio galego, case todas concentradas en Ourense e Lugo.<br><br>
Cando se cruza o rexistro MVMC cos <strong>1.475 incendios</strong> que documentou PrazaGal en 2025, o contraste é claro: <strong>o 39% das hectáreas estimadas queimadas</strong> cae sobre MVMC, case o dobre do peso que lles correspondería por superficie.<br><br>
Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) ou Castro de Escuadro (74%) están entre as parroquias máis castigadas — e son xustamente as de maior concentración veciñal.<br><br>
A explicación ten pouco que ver co réxime xurídico en si: as comunidades de montes foron historicamente un dos poucos axentes que aínda fan xestión activa do monte. A correlación fala, sobre todo, de <strong>onde queda o monte</strong>: nas parroquias rurais do interior ourensán, baleiradas polo éxodo, onde a propiedade colectiva sobrevive porque o minifundio privado se abandonou.
                        </p>
                    </div>
                </div>
          `
        },
        'cimadevila-comparacion': {
          title: '',
          description: `
            <h2>Afastámonos do monte</h2>
                <div class="cimadevila-layout" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div class="vertical-slider-container">
                            <div class="vertical-slider-wrapper">
                                <img class="vertical-slider-img vertical-slider-img-bottom" src="assets/cimadevila_1957.png" alt="Cimadevila 1957">
                                <div class="vertical-slider-overlay">
                                    <img class="vertical-slider-img vertical-slider-img-top" src="assets/cimadevila_2021.png" alt="Cimadevila 2021">
                                </div>
                                <div class="vertical-slider-handle" id="cimadevila-slider">
                                    <div class="vertical-slider-handle-icon"></div>
                                </div>
                                <div class="vertical-slider-labels">
                                    <span class="vertical-slider-label-top">1957</span>
                                    <span class="vertical-slider-label-bottom">2020</span>
                                </div>
                            </div>
                            <p class="slider-caption">
                                Fonte: Comparador do Plan Nacional de Ortofotografía Aérea
                            </p>
                        </div>
                    </div>
                    
                    <div class="cimadevila-text-panel">
                        <div class="cimadevila-text-inner">
                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                                Neste exemplo, en <strong>Cimadevila</strong> (Nogueira de Ramuín), vese con claridade como cambiou a paisaxe galega en poucas décadas.<br><br>
                                Sabemos que moitos incendios están relacionados con <strong>prácticas agrícolas e gandeiras</strong>. E non, a maioría das veces non hai mala intención: trátase de costumes herdadas, dunha forma tradicional de manexar o territorio.<br><br>
                                O problema é que o monte xa non se comporta como antes.<br><br>
                                Durante o último medio século pasamos de <strong>mosaicos abertos e pastoreados</strong> (campos, hortas, prados) a <strong>masas forestais pechadas</strong>, onde o combustible vexetal se acumula.<br><br>
                                Quen segue empregando o lume "como toda a vida" faino nunha paisaxe completamente distinta, e unha simple queima que antes se controlaba con facilidade hoxe pode converterse nun incendio desbocado.
                            </p>
                        </div>
                    </div>
                </div>
          `
        },
        'mapa-calor-causas': {
          title: '',
          description: `
            <h2>O verán alóngase… e o lume tamén</h2>
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
                            Todo isto ocorre nun contexto de cambio climático que aumenta o risco e amplía a tempada de incendios. Neste gráfico podemos ver como mudaron as temperaturas en Galicia desde os anos 40.<br><br>
                            A medida que avanza a serie temporal, os meses fríos van perdendo o ton azul que representa as temperaturas baixas. Esa cor, tan presente nas primeiras décadas, atenúase pouco a pouco ata case desaparecer nas últimas. En paralelo, os veráns vólvense máis cálidos e prolongados, e o vermello ocupa cada vez máis espazo no mapa de cor.<br><br>
                            Este desprazamento cromático representa un quecemento real que amplía a duración das condicións estivais e, con elas, o período de maior risco de incendio. As temperaturas máis altas, sumadas a unha vexetación cada vez máis seca, xeran un escenario no que calquera chispa ten máis posibilidades de converterse nun lume.
                        </p>
                        
                        <div class="only-desktop">
                            <iframe src="https://flo.uri.sh/visualisation/26020279/embed" 
                                    frameborder="0" 
                                    scrolling="no" 
                                    style="width: 100%; height: 720px;">
                            </iframe>
                        </div>

                        <div class="only-mobile">
                            <iframe src="https://flo.uri.sh/visualisation/26412913/embed"
                                    frameborder="0"
                                    scrolling="no"
                                    style="width: 100%; height: 720px;">
                            </iframe>
                        </div>
                        
                        <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6;">
                            Os estudos sobre ondas de calor mostran que estes fenómenos extremos non só aumentan en frecuencia, senón tamén en intensidade e duración.<br><br>
                            Neste contexto, prácticas que antes eran relativamente seguras, como as <strong>queimas agrícolas e gandeiras</strong>, convértense nun risco elevado cando coinciden con períodos de alta temperatura, baixa humidade e ventos intensos.<br><br>
                            A combinación de combustible vexetal acumulado, condicións meteorolóxicas adversas e prácticas tradicionais que non se adaptan ao novo escenario climático explica por que os incendios son cada vez máis devastadores.
                        </p>
                    </div>
                </div>
          `
        }
      }
    }
  };

  var original = {};
  var chapterRefs = {};
  var currentLanguage = 'es';
  var languageSelector = null;
  var categoryTabsContainer = null;
  var layerDescriptionEl = null;
  var mobileViewportQuery = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;

  function isMobileViewport() {
    if (mobileViewportQuery) {
      return mobileViewportQuery.matches;
    }
    var width = window.innerWidth || document.documentElement.clientWidth || 1024;
    return width <= 768;
  }

  function detachCategorySelector() {
    var selector = document.getElementById('category-selector');
    if (!selector || !selector.parentNode) return null;
    var computedDisplay = window.getComputedStyle ? window.getComputedStyle(selector).display : (selector.style.display || '');
    var state = {
      selector: selector,
      wasHidden: selector.classList.contains('category-selector-hidden'),
      wasVisible: computedDisplay !== 'none',
      display: selector.style.display || '',
      parentId: selector.parentNode.id || ''
    };
    selector.parentNode.removeChild(selector);
    return state;
  }

  function restoreCategorySelector(state) {
    if (!state || !state.selector) return;
    var selector = state.selector;
    var target = null;

    if (state.parentId) {
      target = document.getElementById(state.parentId);
    }

    if (!target) {
      var mobileSlot = document.getElementById('category-mobile-slot');
      var home = document.getElementById('category-selector-home');
      target = (isMobileViewport() && mobileSlot) ? mobileSlot : (home || document.body);
    }

    if (!target) {
      document.body.appendChild(selector);
    } else {
      target.appendChild(selector);
    }

    selector.style.display = state.display || '';
    selector.classList.toggle('category-selector-hidden', !!state.wasHidden);

    if (isMobileViewport()) {
      selector.classList.add('category-selector-inline');
      if (!selector.style.display && state.wasVisible) {
        selector.style.display = 'flex';
      }
    } else {
      selector.classList.remove('category-selector-inline');
      if (state.wasVisible && !selector.style.display) {
        selector.style.display = 'flex';
      }
    }
  }

  function deepClone(value) {
    if (value === undefined || value === null) return value;
    if (typeof window.structuredClone === 'function') {
      try {
        return window.structuredClone(value);
      } catch (error) {}
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (err) {
      return value;
    }
  }

  function forEachNode(list, callback) {
    if (!list || typeof callback !== 'function') return;
    Array.prototype.forEach.call(list, callback);
  }

  function captureOriginals() {
    languageSelector = document.getElementById('language-selector');
    categoryTabsContainer = document.querySelector('.category-tabs');
    layerDescriptionEl = document.getElementById('layer-description');

    original.htmlLang = document.documentElement.getAttribute('lang') || 'es';
    original.pageTitle = document.title;
    original.languageSelectorLabel = languageSelector ? languageSelector.getAttribute('aria-label') : '';
    var topbarTitle = document.getElementById('titleRight');
    original.topbarTitle = topbarTitle ? topbarTitle.textContent.trim() : '';
    var heroHeadlineEl = document.querySelector('#hero .hero-headline');
    original.heroHeadline = heroHeadlineEl ? heroHeadlineEl.textContent : '';
    var heroKickerEl = document.querySelector('#hero .hero-kicker p');
    original.heroKicker = heroKickerEl ? heroKickerEl.innerHTML : '';
    var scrollHintEl = document.querySelector('#hero .scroll-hint');
    original.scrollHint = scrollHintEl ? scrollHintEl.textContent : '';
    var heroPhotoCreditEl = document.querySelector('#hero .photo-credit');
    original.heroPhotoCredit = heroPhotoCreditEl ? heroPhotoCreditEl.textContent : '';
    var mapSourceEl = document.querySelector('.map-source');
    original.mapSource = mapSourceEl ? mapSourceEl.textContent : '';
    var sliderCaptionEl = document.querySelector('.slider-caption');
    original.sliderCaption = sliderCaptionEl ? sliderCaptionEl.textContent : '';
    var heroFinalHeadlineEl = document.querySelector('#hero-final .hero-headline');
    original.heroFinalHeadline = heroFinalHeadlineEl ? heroFinalHeadlineEl.textContent : '';
    var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
    original.heroFinalParagraphs = [];
    forEachNode(heroFinalParagraphs, function (node) {
      original.heroFinalParagraphs.push(node.innerHTML);
    });
    var heroFinalCreditEl = document.querySelector('#hero-final .photo-credit');
    original.heroFinalPhotoCredit = heroFinalCreditEl ? heroFinalCreditEl.textContent : '';
    original.categoryDefault = layerDescriptionEl ? layerDescriptionEl.innerHTML : '';
    original.categoryTabs = {};
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (key) {
        original.categoryTabs[key] = btn.textContent.trim();
      }
    });
    original.categoryAriaLabel = categoryTabsContainer ? categoryTabsContainer.getAttribute('aria-label') : '';
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    original.climateAlts = {
      larouco: laroucoImg ? laroucoImg.getAttribute('alt') : '',
      fases: fasesImg ? fasesImg.getAttribute('alt') : ''
    };
    original.categoryContent = deepClone(window.categoryContent);
    original.chapters = {};
    if (window.config && Array.isArray(window.config.chapters)) {
      window.config.chapters.forEach(function (record) {
        var container = document.getElementById(record.id);
        if (!container) return;
        var titleEl = container.querySelector('h3');
        var descEl = container.querySelector('p');
        chapterRefs[record.id] = {
          container: container,
          titleEl: titleEl,
          descriptionEl: descEl
        };
        original.chapters[record.id] = {
          title: titleEl ? titleEl.textContent : '',
          description: descEl ? descEl.innerHTML : ''
        };
      });
    }
  }

  function updateChaptersContent(contentMap) {
    if (!contentMap) return;
    var selectorState = detachCategorySelector();
    Object.keys(chapterRefs).forEach(function (id) {
      var refs = chapterRefs[id];
      if (!refs) return;
      var data = contentMap[id];
      if (!data) return;

      if (data.title !== undefined) {
        if (refs.titleEl) {
          refs.titleEl.textContent = data.title || '';
          refs.titleEl.style.display = data.title ? '' : 'none';
        } else if (data.title) {
          var newTitle = document.createElement('h3');
          newTitle.textContent = data.title;
          if (refs.descriptionEl) {
            refs.descriptionEl.parentNode.insertBefore(newTitle, refs.descriptionEl);
          } else {
            refs.container.appendChild(newTitle);
          }
          refs.titleEl = newTitle;
        }
      }

      if (refs.descriptionEl && data.description !== undefined) {
        refs.descriptionEl.innerHTML = data.description;
      }
    });
    layerDescriptionEl = document.getElementById('layer-description');
    restoreCategorySelector(selectorState);
  }

  function refreshCategoryExplanation() {
    if (typeof window.updateLayerExplanation !== 'function') return;
    var active = window.currentCategory || null;
    if (!active) {
      var pressed = document.querySelector('.category-tab[aria-pressed="true"]');
      if (pressed) {
        active = pressed.getAttribute('data-category');
      }
    }
    window.updateLayerExplanation(active || null);
  }

  function setCategoryContentData(data) {
    if (!data) return;
    window.categoryContent = deepClone(data);
    refreshCategoryExplanation();
  }

  function setElementText(target, value) {
    if (value === undefined) return;
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.textContent = value;
    }
  }

  function setElementHTML(target, value) {
    if (value === undefined) return;
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.innerHTML = value;
    }
  }

  function applyOriginals(skipSelectorUpdate) {
    document.documentElement.setAttribute('lang', original.htmlLang || 'es');
    document.title = original.pageTitle || document.title;
    setElementText('#titleRight', original.topbarTitle);
    setElementText('#hero .hero-headline', original.heroHeadline);
    setElementHTML('#hero .hero-kicker p', original.heroKicker);
    setElementText('#hero .scroll-hint', original.scrollHint);
    setElementText('#hero .photo-credit', original.heroPhotoCredit);
    setElementText('.map-source', original.mapSource);
    setElementText('.slider-caption', original.sliderCaption);
    setElementText('#hero-final .hero-headline', original.heroFinalHeadline);
    var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
    forEachNode(heroFinalParagraphs, function (node, idx) {
      if (original.heroFinalParagraphs[idx] !== undefined) {
        node.innerHTML = original.heroFinalParagraphs[idx];
      }
    });
    setElementText('#hero-final .photo-credit', original.heroFinalPhotoCredit);
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (original.categoryTabs && original.categoryTabs[key]) {
        btn.textContent = original.categoryTabs[key];
      }
    });
    if (categoryTabsContainer && original.categoryAriaLabel !== undefined) {
      categoryTabsContainer.setAttribute('aria-label', original.categoryAriaLabel);
    }
    if (languageSelector && original.languageSelectorLabel !== undefined) {
      languageSelector.setAttribute('aria-label', original.languageSelectorLabel);
    }
    if (layerDescriptionEl && original.categoryDefault !== undefined) {
      layerDescriptionEl.innerHTML = original.categoryDefault;
    }
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    if (laroucoImg && original.climateAlts) {
      laroucoImg.setAttribute('alt', original.climateAlts.larouco || '');
    }
    if (fasesImg && original.climateAlts) {
      fasesImg.setAttribute('alt', original.climateAlts.fases || '');
    }
    setCategoryContentData(original.categoryContent);
    updateChaptersContent(original.chapters);
    if (!skipSelectorUpdate) {
      updateLanguageSelectorUI('es');
    }
  }

  function applyTranslations(dict) {
    if (!dict) return;
    document.documentElement.setAttribute('lang', dict.htmlLang || 'gl');
    document.title = dict.pageTitle || document.title;
    setElementText('#titleRight', dict.topbarTitle);
    setElementText('#hero .hero-headline', dict.heroHeadline);
    setElementHTML('#hero .hero-kicker p', dict.heroKicker);
    setElementText('#hero .scroll-hint', dict.scrollHint);
    setElementText('#hero .photo-credit', dict.heroPhotoCredit);
    setElementText('.map-source', dict.mapSource);
    setElementText('.slider-caption', dict.sliderCaption);
    if (dict.heroFinal) {
      setElementText('#hero-final .hero-headline', dict.heroFinal.headline);
      var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
      forEachNode(heroFinalParagraphs, function (node, idx) {
        if (dict.heroFinal.paragraphs && dict.heroFinal.paragraphs[idx] !== undefined) {
          node.innerHTML = dict.heroFinal.paragraphs[idx];
        }
      });
      if (dict.heroFinal.photoCredit !== undefined) {
        setElementText('#hero-final .photo-credit', dict.heroFinal.photoCredit);
      }
    }
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (dict.categoryTabs && dict.categoryTabs[key]) {
        btn.textContent = dict.categoryTabs[key];
      }
    });
    if (categoryTabsContainer && dict.categoryAriaLabel) {
      categoryTabsContainer.setAttribute('aria-label', dict.categoryAriaLabel);
    }
    if (languageSelector && dict.languageSelectorLabel) {
      languageSelector.setAttribute('aria-label', dict.languageSelectorLabel);
    }
    if (layerDescriptionEl && dict.categoryDefault !== undefined) {
      layerDescriptionEl.innerHTML = dict.categoryDefault;
    }
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    if (laroucoImg && dict.climateAlts && dict.climateAlts.larouco) {
      laroucoImg.setAttribute('alt', dict.climateAlts.larouco);
    }
    if (fasesImg && dict.climateAlts && dict.climateAlts.fases) {
      fasesImg.setAttribute('alt', dict.climateAlts.fases);
    }
    if (dict.categoryContent) {
      setCategoryContentData(dict.categoryContent);
    }
    updateChaptersContent(dict.chapters);
  }

  function updateLanguageSelectorUI(lang) {
    forEachNode(document.querySelectorAll('#language-selector .language-button'), function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.classList.toggle('language-button--active', !!isActive);
    });
  }

  function setLanguage(lang) {
    if (lang === currentLanguage) return;
    if (lang === 'es') {
      applyOriginals();
    } else if (lang === 'gl' && translations.gl) {
      applyTranslations(translations.gl);
    } else {
      return;
    }
    currentLanguage = lang;
    updateLanguageSelectorUI(lang);
  }

  function initLanguageSelector() {
    if (!languageSelector) return;
    languageSelector.addEventListener('click', function (event) {
      var target = event.target.closest('button[data-lang]');
      if (!target) return;
      setLanguage(target.getAttribute('data-lang'));
    });
  }

  captureOriginals();
  applyOriginals(true);
  initLanguageSelector();
  updateLanguageSelectorUI(currentLanguage);

  window.setStoryLanguage = setLanguage;
})();

