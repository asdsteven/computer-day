const tileWidth = 62;
const tileHeight = 62;
const worldWidth = tileWidth * 36;
const worldHeight = tileHeight * 27;

const levels = [
    {
        difficulty: 0,
        hint: 'Can she get out of the classroom?',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Make a turn',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Make a big turn',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward"><next><block type="forward"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , '  X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'Either exits are fine',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'E     '
               , '      '
               , 'X X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'Turn behind',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_right"><next><block type="turn_right"><next><block type="forward"><next><block type="forward"><next><block type="forward"><next><block type="turn_left"><next><block type="forward"><next><block type="forward"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ '   E  '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Desks would block the way',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="turn_left"><next><block type="forward"><next><block type="turn_right"><next><block type="control_repeat"><statement name="SUBSTACK"><block type="forward"></block></statement><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">3</field></shadow></value><next><block type="turn_right"><next><block type="forward"><next><block type="turn_left"><next><block type="forward"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S     '
               , 'O     '
               , '      '
               , 'X     '
        ]
    },
    {
        difficulty: 0,
        hint: 'Only one forward / turn block is allowed',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: [ 'S   '
               , '    '
               , '    '
               , 'X   '
        ]
    },
    {
        difficulty: 0,
        hint: 'You have completed the introduction!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 0,
        hint: 'You have completed the introduction!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="V7q^L$`BRlYM$w,-.ty?" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="Un5P|W?nR)!n/o~IxM4x"><statement name="SUBSTACK"><block type="turn_right" id="K6Rl3S~OxcfywL-BW?Zc"><next><block type="control_repeat" id="}_|):9!?uC5s=_$j1Br4"><statement name="SUBSTACK"><block type="forward" id="E#menU+QSrLsj21vJMN-"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="I-Vp2~*SD~o.-f,)0^*%"><field name="NUM">3</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="Y.qt+Co_UQTKcGF//YLr"><field name="NUM">4</field></shadow></value></block></next></block></xml>',
        tiles: ['N  ',
                ' O ',
                '  X']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="i7`5(VoCS#I$.c.f@;Tc" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="*,6aKL/?ex]z4z(=#BHy"><statement name="SUBSTACK"><block type="forward" id="oTIlZu0K-2o@4o[Ei+$e"><next><block type="turn_right" id="f40s*4ZT)k|o58dSD-es"><next><block type="forward" id="})dCD?OR$:KUDzfW5B{h"><next><block type="turn_left" id="(|[7l;6Mj}U8AefAx:qg"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="E8G,`~i:[VL^k0E%-7#G"><field name="NUM">5</field></shadow></value></block></next></block></xml>',
        tiles: ['E   ',
                ' O O',
                '    ',
                '   X']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="F+Znau+~gRQc$zR`W;I)" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="JfZO:itli#JfRo`3E^[2"><statement name="SUBSTACK"><block type="control_repeat" id="u41d9F)D4`ZqIc0$ndmq"><statement name="SUBSTACK"><block type="forward" id="E|Xic~d0c=[pcWcS=erK" deletable="false"><next><block type="turn_left" id="xWboFf-;6m{kq$9=8=^/" deletable="false"><next><block type="forward" id="jDe?WeREn$yP8g]A]R$*" deletable="false"><next><block type="turn_right" id="v6h=5=cK9KsIzxqrbLIM" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="iwv2CT9Hl:p}H`_9a)`G"><field name="NUM">10</field></shadow></value><next><block type="turn_right" id="VZyWr^*Pg?]==Cq/IP@K" deletable="false"></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="}u)]ReH((]f~hT75!|Oj"><field name="NUM">2</field></shadow></value></block></next></block><block type="turn_left" id="64@JZV0dFHH#Gj7JLW?!" deletable="false" x="246" y="202"></block></xml>',
        tiles: ['  O O',  
                ' S  O',  
                'O   O',  
                ' O   ',  
                'X    ']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="n]El%yzz2]G0xLJ18?GD" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="q:|c!Y){3J35#ovIIAY8"><statement name="SUBSTACK"><block type="turn_right" id="LRvP~@n8f/Hbv:O_gOk7"><next><block type="forward" id="MPtrHQkoplt0imB0Gx7p"><next><block type="turn_left" id="}urTUFK]%P=5,6kjV(2%"><next><block type="forward" id="Wyrnph]~YCrAcH9[);uS"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="%Nf=^[jn~JYr@m*7)1-S"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        tiles: ['O O  O',  
                ' E   O',  
                'O    O',  
                ' O O  ',  
                '     O',  
                'X  X X']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="ZY$)ndvF0h3q,|Cd6%qw"><statement name="SUBSTACK"><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="1Zv%YQTgsmf[T=x=:s$n"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        tiles: ['S     ',
                ' O O O',
                '     O',
                'O O   ',
                '    OX']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="4l[Rj)$}{F8-h?hsAFBi"><statement name="SUBSTACK"><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="Kn52r={57(A7jgR+Wa%J"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        tiles: ['S      ',
                '   O  O',
                '      X']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="hD+m^OFQaA_K-?K!h~~." deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="U/G4hq^-M%/Mb+i[)JDE"><statement name="SUBSTACK"><block type="turn_right" id="=1,jfKIQH,.m//e0jtzh"><next><block type="control_repeat" id=".G%.[~2XdWn~4UD%g$pi"><statement name="SUBSTACK"><block type="forward" id="A2Q`7+qcmjL.|aav{[aO"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="bu7gzEQ~+_4YW=u0p+uN"><field name="NUM">6</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="-q#!~,+S4^V-iTu9hu0k"><field name="NUM">3</field></shadow></value></block></next></block></xml>',
        tiles: ['   OO', 
                'W  O ', 
                ' O   ', 
                '    O', 
                '  X  ']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="r5An}.0Mx~-}Op_{fN}6" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="k%3Nt0BpuI-1qS;RRU[*"><statement name="SUBSTACK"><block type="turn_left" id="B[+/^I@}NlHgAJ!V$e,S"><next><block type="control_repeat" id="md,O!%WOCd4FR{vr*ajx"><statement name="SUBSTACK"><block type="forward" id="`gd,[b{|uB5z(:[Z6JCu"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="6I*eno#BrB2_GI_?%yDn"><field name="NUM">5</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="%xceR4wEel%mj(XB~dOh"><field name="NUM">3</field></shadow></value><next><block type="turn_right" id="cb=!v%n+@~1/uv$`=BP!"><next><block type="control_repeat" id="?0fi!ZR5(21S%YN.us7r"><statement name="SUBSTACK"><block type="forward" id="?.~gRybtq!c3MTQXoIEd"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="yX?tfd0Z9dPJcf*ijZzF"><field name="NUM">4</field></shadow></value></block></next></block></next></block></next></block></xml>',
        tiles: ['  O N',  
                ' O  O',  
                '     ',  
                'O  O ',  
                'X   X']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"><next><block type="turn_left" id="B%m1xBiT4pj?V)j-g1;n"><next><block type="turn_left" id="VXw3{s1oU#%IfSd3PezE"><next><block type="control_repeat" id="42XD!;9iYO9Io4vG|2[G"><statement name="SUBSTACK"><block type="forward" id="6$6cd`/sB$Wrvs`xP#uO"><next><block type="turn_right" id="D#L`1wvQC2}W-!~pieqo"><next><block type="forward" id="`d%(V^zF}:JGYc?#1LCX"><next><block type="turn_left" id="3s-r9xV;2[wmG9TAH.O6"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="JspkW7@=#Jk#,B1K}K^e"><field name="NUM">4</field></shadow></value></block></next></block></next></block></next></block></xml><xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="!RbbL_)DEqCG|SEX@Wq!" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="_#(v;7VjaYzp/q2w}O6^"><statement name="SUBSTACK"><block type="control_repeat" id="K0LG1U{bJU-^kt:F3lmL"><statement name="SUBSTACK"><block type="forward" id="%1VK5$9ug/-Cthlfh|-n"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="X^RKDYWI#v:?bA/R~.E~"><field name="NUM">2</field></shadow></value><next><block type="turn_right" id="NDK5.K9o7r]EvEZ%xROm"></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="iDe-J(1@mt}Z@8M9w4,Q"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        tiles: ['W    O',  
                ' O   O',  
                'O    O',  
                'O  X X']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"></block></xml>',
        tiles: ['O O E',  
                '   O ',  
                'O    ',  
                ' O  O',  
                'X X  ']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"></block></xml>',
        tiles: ['  O  W',  
                ' O   O',  
                '     O',  
                'O O   ',  
                '   O O',  
                'X X  X']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"></block></xml>',
        tiles: ['N O  O ',  
                ' O    O',  
                '      O',  
                'O X X X'] 
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"></block></xml>',
        tiles: ['O S O',  
                '    O',  
                'O   O',  
                ' O   ',  
                'X  XO']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Zl8u45~b#SvK}^/U%Z=)" deletable="false" movable="false" x="10" y="30"></block></xml>',
        tiles: ['O O O E',  
                '      O',  
                'O O   O',  
                'O     O',  
                ' O O   ',  
                'X   X X']  
    },
    {
        difficulty: 1,
        hint: 'One forward allowed',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="V7q^L$`BRlYM$w,-.ty?" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="Un5P|W?nR)!n/o~IxM4x"><statement name="SUBSTACK"><block type="turn_right" id="K6Rl3S~OxcfywL-BW?Zc"><next><block type="control_repeat" id="}_|):9!?uC5s=_$j1Br4"><statement name="SUBSTACK"><block type="forward" id="E#menU+QSrLsj21vJMN-"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="I-Vp2~*SD~o.-f,)0^*%"><field name="NUM">3</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="Y.qt+Co_UQTKcGF//YLr"><field name="NUM">4</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: ['N  ',
                ' O ',
                '  X']
    },
    {
        difficulty: 1,
        hint: 'Two forwards allowed',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="i7`5(VoCS#I$.c.f@;Tc" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="*,6aKL/?ex]z4z(=#BHy"><statement name="SUBSTACK"><block type="forward" id="oTIlZu0K-2o@4o[Ei+$e"><next><block type="turn_right" id="f40s*4ZT)k|o58dSD-es"><next><block type="forward" id="})dCD?OR$:KUDzfW5B{h"><next><block type="turn_left" id="(|[7l;6Mj}U8AefAx:qg"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="E8G,`~i:[VL^k0E%-7#G"><field name="NUM">5</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['E   ',
                ' O O',
                '    ',
                '   X']
    },
    {
        difficulty: 1,
        hint: 'Two forward / turn blocks allowed',
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="F+Znau+~gRQc$zR`W;I)" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="JfZO:itli#JfRo`3E^[2"><statement name="SUBSTACK"><block type="control_repeat" id="u41d9F)D4`ZqIc0$ndmq"><statement name="SUBSTACK"><block type="forward" id="E|Xic~d0c=[pcWcS=erK" deletable="false"><next><block type="turn_left" id="xWboFf-;6m{kq$9=8=^/" deletable="false"><next><block type="forward" id="jDe?WeREn$yP8g]A]R$*" deletable="false"><next><block type="turn_right" id="v6h=5=cK9KsIzxqrbLIM" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="iwv2CT9Hl:p}H`_9a)`G"><field name="NUM">10</field></shadow></value><next><block type="turn_right" id="VZyWr^*Pg?]==Cq/IP@K" deletable="false"></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="}u)]ReH((]f~hT75!|Oj"><field name="NUM">2</field></shadow></value></block></next></block><block type="turn_left" id="64@JZV0dFHH#Gj7JLW?!" deletable="false" x="246" y="202"></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="F+Znau+~gRQc$zR`W;I)" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="E|Xic~d0c=[pcWcS=erK" deletable="false"><next><block type="forward" id="jDe?WeREn$yP8g]A]R$*" deletable="false"><next><block type="turn_left" id="xWboFf-;6m{kq$9=8=^/" deletable="false"><next><block type="turn_left" id="64@JZV0dFHH#Gj7JLW?!" deletable="false"><next><block type="turn_right" id="VZyWr^*Pg?]==Cq/IP@K" deletable="false"><next><block type="turn_right" id="v6h=5=cK9KsIzxqrbLIM" deletable="false"></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['  O O',  
                ' S  O',  
                'O   O',  
                ' O   ',  
                'X    ']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="n]El%yzz2]G0xLJ18?GD" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="q:|c!Y){3J35#ovIIAY8"><statement name="SUBSTACK"><block type="turn_right" id="LRvP~@n8f/Hbv:O_gOk7"><next><block type="forward" id="MPtrHQkoplt0imB0Gx7p"><next><block type="turn_left" id="}urTUFK]%P=5,6kjV(2%"><next><block type="forward" id="Wyrnph]~YCrAcH9[);uS"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="%Nf=^[jn~JYr@m*7)1-S"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['O O  O',  
                ' E   O',  
                'O    O',  
                ' O O  ',  
                '     O',  
                'X  X X']  
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="ZY$)ndvF0h3q,|Cd6%qw"><statement name="SUBSTACK"><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="1Zv%YQTgsmf[T=x=:s$n"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['S     ',
                ' O O O',
                '     O',
                'O O   ',
                '    OX']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="4l[Rj)$}{F8-h?hsAFBi"><statement name="SUBSTACK"><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="Kn52r={57(A7jgR+Wa%J"><field name="NUM">10</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['S      ',
                '   O  O',
                '      X']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="hD+m^OFQaA_K-?K!h~~." deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="U/G4hq^-M%/Mb+i[)JDE"><statement name="SUBSTACK"><block type="turn_right" id="=1,jfKIQH,.m//e0jtzh"><next><block type="control_repeat" id=".G%.[~2XdWn~4UD%g$pi"><statement name="SUBSTACK"><block type="forward" id="A2Q`7+qcmjL.|aav{[aO"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="bu7gzEQ~+_4YW=u0p+uN"><field name="NUM">6</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="-q#!~,+S4^V-iTu9hu0k"><field name="NUM">3</field></shadow></value></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" deletable="false" movable="false" x="10" y="30"><next><block type="forward" deletable="false"><next><block type="turn_left" deletable="false"><next><block type="turn_right" deletable="false"></block></next></block></next></block></next></block></xml>',
        tiles: ['   OO', 
                'W  O ', 
                ' O   ', 
                '    O', 
                '  X  ']
    },
    {
        difficulty: 1,
        answer: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="r5An}.0Mx~-}Op_{fN}6" deletable="false" movable="false" x="10" y="30"><next><block type="control_repeat" id="k%3Nt0BpuI-1qS;RRU[*"><statement name="SUBSTACK"><block type="turn_left" id="B[+/^I@}NlHgAJ!V$e,S"><next><block type="control_repeat" id="md,O!%WOCd4FR{vr*ajx"><statement name="SUBSTACK"><block type="forward" id="`gd,[b{|uB5z(:[Z6JCu"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="6I*eno#BrB2_GI_?%yDn"><field name="NUM">5</field></shadow></value></block></next></block></statement><value name="TIMES"><shadow type="math_whole_number" id="%xceR4wEel%mj(XB~dOh"><field name="NUM">3</field></shadow></value><next><block type="turn_right" id="cb=!v%n+@~1/uv$`=BP!"><next><block type="control_repeat" id="?0fi!ZR5(21S%YN.us7r"><statement name="SUBSTACK"><block type="forward" id="?.~gRybtq!c3MTQXoIEd"></block></statement><value name="TIMES"><shadow type="math_whole_number" id="yX?tfd0Z9dPJcf*ijZzF"><field name="NUM">4</field></shadow></value></block></next></block></next></block></next></block></xml>',
        blocks: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="Q]qPT(GX8V=f{~)p1v/Z" deletable="false" movable="false" x="10" y="30"><next><block type="forward" id="A:;`DeqWnj?X,RYrtFzJ" deletable="false"><next><block type="forward" id="EKJOk@S?vFJOv%bD_h|4" deletable="false"><next><block type="turn_left" id="mon.y-[rj!Qpq]891`D)" deletable="false"><next><block type="turn_right" id="M{t1:WHWXBkO5FPUVZoy" deletable="false"></block></next></block></next></block></next></block></next></block></xml>',
        tiles: ['  O N',  
                ' O  O',  
                '     ',  
                'O  O ',  
                'X   X']  
    },
    {
        difficulty: 1,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 1,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 2,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 2,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
    {
        difficulty: 3,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
    },
    {
        difficulty: 3,
        hint: 'You have completed the level!',
        tiles: [ 'S'
               , ' '
               , 'X'
        ],
        done: true
    },
];
const levelBegins = [null, null, null, null];

for (const [i, level] of levels.entries()) {
    if (levelBegins[level.difficulty] == null) {
        levelBegins[level.difficulty] = i;
    }
    const tiles = level.tiles;
    const info = {};
    info.cols = tiles[0].length;
    info.rows = tiles.length;
    info.roomWidth = info.cols * tileWidth;
    info.roomHeight = info.rows * tileHeight;
    info.viewWidth = info.roomWidth + tileWidth * 4;
    info.viewHeight = info.roomHeight + tileHeight * 4;
    for (let r = 0; r < info.rows; r++) {
        for (let c = 0; c < info.cols; c++) {
            const t = tiles[r][c];
            if ('NESW'.includes(t)) {
                info.SR = r;
                info.SC = c;
                info.dir = 'NESW'.indexOf(t);
            }
        }
    }
    level.info = info;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { levelBegins };
}
