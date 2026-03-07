import {
    Brain, Eye, Sparkles, Layout, Shield, Rocket,
    Anchor, Users, Clock, BookHeart, PenTool, Palette,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   Type definitions
   ═══════════════════════════════════════════════ */

export interface Reference {
    authors: string
    year: number
    title: string
    source: string
    url?: string
}

export interface KnowledgeItem {
    slug: string
    icon: typeof Brain
    color: string
    dotColor: string
    title: string
    subtitle: string
    description: string
    metrics?: string
    article: {
        brain: { heading: string; paragraphs: string[] }
        failures: { heading: string; items: { label: string; detail: string }[] }
        prescription: { heading: string; items: string[] }
        references: Reference[]
        furtherReading?: { label: string; url: string; description: string }[]
    }
}

/* ═══════════════════════════════════════════════
   Knowledge Items — 10 articles, full content
   ═══════════════════════════════════════════════ */

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
    /* ─── 1. Cognitive Load ─── */
    {
        slug: 'cognitive-load',
        icon: Brain,
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        dotColor: 'bg-indigo-500',
        title: 'Cognitive Load',
        subtitle: '認知負荷の最適化',
        description: '人間の脳が一度に処理できる情報量には限界があります。LPに過剰な情報を配置すると、「何もしない」という選択を導きます。',
        article: {
            brain: {
                heading: '脳の仕組み：ワーキングメモリの壁',
                paragraphs: [
                    'あなたの脳には「ワーキングメモリ」と呼ばれる作業台があります。この台に同時に載せられる情報は、心理学者George Millerの研究（1956）によればわずか7±2個。しかし近年のCowan（2001）の研究では、実効的には4±1個まで減少することが示されています。',
                    'LPを開いた瞬間、訪問者のワーキングメモリには「ヘッドライン」「画像」「ナビゲーション」「CTA」「色彩」「フォント」——これらの情報が一斉に流入します。わずか0.3秒。この時間で脳は「処理するか」「無視するか」を決定します。',
                    '問題は、情報量が脳の処理能力を超えた瞬間に起きます。心理学ではこれを「認知過負荷（Cognitive Overload）」と呼びます。過負荷状態に陥った脳は、最も合理的な選択——「何もしない」——を選びます。これがLPにおける離脱の正体です。',
                ],
            },
            failures: {
                heading: 'よくある失敗：情報の洪水',
                items: [
                    { label: 'CTAの乱立', detail: 'ファーストビューに「資料請求」「無料相談」「LINE登録」の3つのボタンが並ぶ。訪問者は「どれを押せばいいか」を考え始め、結果どれも押さない。選択肢の数は1つが最適。' },
                    { label: '色彩のカオス', detail: '赤、青、緑、黄、オレンジ——5色以上のアクセントカラーが混在するLP。脳は「どこが重要か」を判別できず、視線が定まらない。色彩は3色以内に制限するのが鉄則。' },
                    { label: '段落なき長文', detail: '改行なしで200文字以上が続くコピー。視覚的に「読む量が多い」と判断された時点で、脳は読解を放棄する。1段落は60〜80文字が上限。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：明日から使える改善策',
                items: [
                    'ファーストビューの情報要素を5つ以下に削減せよ。ロゴ、ヘッドライン、サブヘッドライン、ビジュアル、CTA——これだけで十分。',
                    'CTAボタンをファーストビューに1つだけ配置し、アクセントカラーはそのボタンにのみ使え。他の要素はモノトーンで統一。',
                    '行間をfont-sizeの1.8倍以上に設定し、段落間には24px以上の余白を確保。「詰まっている」と感じさせた時点で負け。',
                    'メインコピーに使う修飾語は最大2つ。「誰でも簡単にすぐ始められる」ではなく「今日から始められる」。引き算こそ最大の武器。',
                ],
            },
            references: [
                { authors: 'Miller, G. A.', year: 1956, title: 'The Magical Number Seven, Plus or Minus Two', source: 'Psychological Review, 63(2), 81–97', url: 'https://doi.org/10.1037/h0043158' },
                { authors: 'Cowan, N.', year: 2001, title: 'The Magical Number 4 in Short-Term Memory', source: 'Behavioral and Brain Sciences, 24(1), 87–114', url: 'https://doi.org/10.1017/S0140525X01003922' },
                { authors: 'Sweller, J.', year: 1988, title: 'Cognitive Load During Problem Solving: Effects on Learning', source: 'Cognitive Science, 12(2), 257–285', url: 'https://doi.org/10.1207/s15516709cog1202_4' },
                { authors: 'Hick, W. E.', year: 1952, title: 'On the Rate of Gain of Information', source: 'Quarterly Journal of Experimental Psychology, 4(1), 11–26', url: 'https://doi.org/10.1080/17470215208416600' },
            ],
            furtherReading: [
                { label: '認知負荷理論を実務に活かすガイド', url: 'https://www.nngroup.com/articles/minimize-cognitive-load/', description: 'Nielsen Norman Groupによる実務者向け認知負荷の解説' },
            ],
        },
    },

    /* ─── 2. Attention Drift ─── */
    {
        slug: 'attention-drift',
        icon: Eye,
        color: 'bg-violet-50 text-violet-600 border-violet-100',
        dotColor: 'bg-violet-500',
        title: 'Attention Drift',
        subtitle: '注意力の分散防止',
        description: '訪問者の視線がCTAに至る0.3秒間に、注意は複数のビジュアル要素によって分散されます。視線誘導の設計が成否を分けます。',
        article: {
            brain: {
                heading: '脳の仕組み：サリエンシーマップ',
                paragraphs: [
                    '人間の視覚システムは、ページを見た瞬間に「サリエンシーマップ（顕著性マップ）」と呼ばれる注意の地図を無意識に生成します。色のコントラストが強い場所、動きがある場所、人間の顔がある場所——これらが優先的に目に入ります。',
                    'Nielsen Norman Groupの研究では、ユーザーはWebページをF字型パターンで走査する傾向が確認されています。最初の視線は左上から右へ、次に少し下がって再び右へ、そして最後に左側を縦に流す。しかしLPにおいて重要なのは、このF字パターンを意図的に「破壊」し、CTAへ視線を強制的に導く設計です。',
                    'Lindgaard et al.（2006）の研究は衝撃的です。被験者はWebページを見てわずか50ミリ秒——0.05秒——で「信頼できるか」「美しいか」を判断していました。そしてこの第一印象は、その後の詳細な閲覧後も変わりませんでした。最初の一瞬で勝負は決まっています。',
                ],
            },
            failures: {
                heading: 'よくある失敗：視線の迷子',
                items: [
                    { label: '主役不在のファーストビュー', detail: 'ヘッドラインと同じフォントサイズで書かれた補足テキスト、主張の強い背景画像、色のついたバッジが3つ——すべてが「自分を見て」と主張し、結果として何も目に入らない。主役は常に1つだけ。' },
                    { label: 'CTAの色が背景に溶けている', detail: '白背景にグレーのボタン、または全体がブルー系でボタンもブルー。ボタンが「見つからない」のではなく「視線が止まらない」のが問題。ページ内で唯一の「異質な色」をCTAに使え。' },
                    { label: '装飾的アニメーションの罠', detail: 'パーティクル、パララックス、スライダーの自動切り替え——動く要素に視線は奪われ、肝心のコピーとCTAは無視される。動きは「注意を引くための手段」であり「飾り」ではない。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：視線を支配する技術',
                items: [
                    'ヘッドラインのフォントサイズをボディテキストの最低3倍に設定。サイズ差こそが「ここを最初に読め」というサインになる。',
                    'ページ全体をモノトーンで統一し、CTAボタンにのみ補色（反対色）を適用せよ。ページ内で「最も目立つ点」がCTAでなければならない。',
                    '人物写真を使う場合、その人物の視線をCTAの方向に向けよ。人間は本能的に他者の視線の先を追う（Gaze Cueing Effect）。',
                    '1スクロールごとに情報の「山」を1つだけ置け。複数の主張を1画面に詰め込むと、脳は処理を諦める。',
                ],
            },
            references: [
                { authors: 'Lindgaard, G. et al.', year: 2006, title: 'Attention Web Designers: You Have 50 Milliseconds to Make a Good First Impression!', source: 'Behaviour & Information Technology, 25(2), 115–126', url: 'https://doi.org/10.1080/01449290500330448' },
                { authors: 'Nielsen, J.', year: 2006, title: 'F-Shaped Pattern for Reading Web Content', source: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/' },
                { authors: 'Itti, L. & Koch, C.', year: 2001, title: 'Computational Modelling of Visual Attention', source: 'Nature Reviews Neuroscience, 2(3), 194–203', url: 'https://doi.org/10.1038/35058500' },
                { authors: 'Friesen, C. K. & Kingstone, A.', year: 1998, title: 'The Eyes Have It! Reflexive Orienting is Triggered by Nonpredictive Gaze', source: 'Psychonomic Bulletin & Review, 5(3), 490–495', url: 'https://doi.org/10.3758/BF03208827' },
            ],
            furtherReading: [
                { label: '視線追跡研究の実践ガイド', url: 'https://www.nngroup.com/articles/eyetracking-study-guide/', description: 'NNGroupによるアイトラッキング研究の包括的解説' },
            ],
        },
    },

    /* ─── 3. Satori Insight ─── */
    {
        slug: 'satori-insight',
        icon: Sparkles,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        dotColor: 'bg-emerald-500',
        title: 'Satori Insight',
        subtitle: '現場知見の統合',
        description: '10,000時間以上の実店舗における顧客行動の観察データをAIモデルに統合。現場の温度を持つ分析が私たちの強みです。',
        article: {
            brain: {
                heading: '脳の仕組み：System 1の支配',
                paragraphs: [
                    'ノーベル経済学賞を受賞したDaniel Kahnemanの「二重過程理論」が、私たちの分析の理論的基盤です。人間にはSystem 1（直感的・高速・自動的）とSystem 2（分析的・低速・意識的）の2つの思考モードがあります。',
                    '購買の意思決定において支配的なのはSystem 1です。コンビニのレジ横に並ぶ商品を見て「あ、これ食べたい」と手に取る行為。この判断は0.3秒以内にSystem 1が自動的に下しています。価格、栄養成分、類似商品との比較——System 2による分析は、手に取った「後」に起きる事後正当化に過ぎません。',
                    'LPにおいても構造は同じです。訪問者はファーストビューの0.3秒でSystem 1的に「自分に関係あるか」を判断します。ここで「関係ない」と判定されれば、いかに論理的なコピーをPageの下部に書いても、永遠に読まれることはありません。',
                ],
            },
            failures: {
                heading: 'よくある失敗：「正しい」けど「刺さらない」LP',
                items: [
                    { label: '機能と仕様の羅列', detail: '「高性能CPU搭載」「防水IPX7」「バッテリー48時間」——正確だが、System 1には何も響かない。System 1が反応するのは「明日の雨も、これなら気にならない」のような、感情と状況にフィットした言葉。' },
                    { label: 'ターゲット不在のコピー', detail: '「みなさま」「多くの方に」——誰にも向けていないメッセージは、誰にも刺さらない。「36歳、管理職。金曜の夜、部下の成績報告を見てため息をつくあなたへ」——ここまで絞って初めてSystem 1は「自分のことだ」と反応する。' },
                    { label: '温度のない推薦文', detail: '「大変満足しました」「使いやすかったです」——どのLPにも書いてある定型文。コンビニの常連客は「あのパン、少し焼くと耳までうまいんだよ」と語る。この具体性と身体感覚こそが信頼を生む。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：System 1を味方にする技術',
                items: [
                    '機能ではなく「体験」を語れ。「1TB保存」ではなく「iPhoneの写真、全部入る」。あなたの商品を使った5秒後に起きる変化を言語化せよ。',
                    'ターゲットの「今日の状況」をヘッドラインに入れよ。「仕事帰り」「子どもを寝かしつけた後」「給料日前」——時間と場所の具体性がSystem 1の「自分事フィルター」を通過する鍵。',
                    '推薦文には「数字」「身体感覚」「変化のプロセス」を必ず含めよ。「3ヶ月で7kg減。階段で息が切れなくなった日、泣いた」——これが人を動かす証言。',
                    'CTAのコピーに「今」を入れよ。「申し込む」は先延ばしを生む。「今日、最初の一歩を踏み出す」はSystem 1に行動のトリガーを与える。',
                ],
            },
            references: [
                { authors: 'Kahneman, D.', year: 2011, title: 'Thinking, Fast and Slow', source: 'Farrar, Straus and Giroux', url: 'https://scholar.google.com/scholar?q=Kahneman+Thinking+Fast+and+Slow+2011' },
                { authors: 'Stanovich, K. E. & West, R. F.', year: 2000, title: 'Individual Differences in Reasoning', source: 'Behavioral and Brain Sciences, 23(5), 645–665', url: 'https://doi.org/10.1017/S0140525X00003435' },
                { authors: 'Damasio, A. R.', year: 1994, title: "Descartes' Error: Emotion, Reason, and the Human Brain", source: 'Putnam Publishing', url: 'https://doi.org/10.1016/S0006-3223(95)00474-1' },
            ],
            furtherReading: [
                { label: 'System 1 / System 2 思考の実務応用', url: 'https://www.nngroup.com/articles/dual-process-theory/', description: 'NNGroupによる二重過程理論のUXへの応用解説' },
            ],
        },
    },

    /* ─── 4. Physical Fit ─── */
    {
        slug: 'physical-fit',
        icon: Layout,
        color: 'bg-sky-50 text-sky-600 border-sky-100',
        dotColor: 'bg-sky-500',
        title: 'Physical Fit',
        subtitle: '身体感覚に訴えるレイアウト',
        description: 'スクロールと情報の階層を一致させ、読み手の身体感覚に沿った自然な情報摂取を実現。離脱率を大幅に低減します。',
        metrics: '平均滞在時間 +42%',
        article: {
            brain: {
                heading: '脳の仕組み：身体化された認知',
                paragraphs: [
                    'Embodied Cognition（身体化された認知）という概念があります。Barsalou（2008）の研究は、思考や判断が純粋に「脳内」で完結するのではなく、身体の状態や物理的な動作に深く影響されることを示しました。',
                    'スクロールという行為を考えてください。下方向への移動は、心理的に「深まり」「進行」「没入」の感覚と結びついています。逆に、横スクロールや予期しないジャンプは認知的な違和感を生みます。人間の身体感覚に逆らうレイアウトは、無意識レベルで「居心地の悪さ」を引き起こします。',
                    'さらに、Fittsの法則によれば、ターゲット（ボタン）への到達時間はターゲットのサイズと距離に依存します。つまり、CTAは十分に大きく、かつユーザーの自然な動線上に配置されなければなりません。',
                ],
            },
            failures: {
                heading: 'よくある失敗：身体に逆らうLP',
                items: [
                    { label: '起承転結なきスクロール', detail: '情報が均一密度で縦に並ぶだけのLP。コンビニの棚も、目線の高さに「売りたい商品」を集中配置する。情報にもメリハリ——疎と密のリズム——が必要。' },
                    { label: 'CTAまでの果てしない距離', detail: 'ファーストビューから10スクロール以上しないとCTAに到達できないLP。スーパーのレジまで200メートルある店に、客は並ばない。CTAは「手の届く場所」に。' },
                    { label: 'モバイルでの横溢れ', detail: '画面幅を無視した画像やテーブル。モバイルで横スクロールが発生した瞬間、ユーザーの信頼は崩壊する。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：身体が喜ぶレイアウト',
                items: [
                    '各セクションに80px以上の余白を設け、「章」の切れ目を身体に知覚させよ。余白は「何もない空間」ではなく「呼吸する場所」。',
                    '情報密度を「起→承→転→結」で設計せよ。ファーストビュー（起）で興味を引き、理論（承）で納得させ、証拠（転）で確信させ、CTA（結）で行動させる。',
                    'CTAをページ内に最低3箇所配置し、訪問者の「今買いたい」衝動が発生したどの地点からでも1スクロール以内で行動可能にせよ。',
                    'モバイルでは全要素をmax-width: 100%とし、横スクロールを物理的に不可能にせよ。テーブルはカード型UIに置き換え。',
                ],
            },
            references: [
                { authors: 'Barsalou, L. W.', year: 2008, title: 'Grounded Cognition', source: 'Annual Review of Psychology, 59, 617–645', url: 'https://doi.org/10.1146/annurev.psych.59.103006.093639' },
                { authors: 'Fitts, P. M.', year: 1954, title: 'The Information Capacity of the Human Motor System', source: 'Journal of Experimental Psychology, 47(6), 381–391', url: 'https://doi.org/10.1037/h0055392' },
                { authors: 'Lidwell, W. et al.', year: 2010, title: 'Universal Principles of Design', source: 'Rockport Publishers', url: 'https://scholar.google.com/scholar?q=Lidwell+Universal+Principles+of+Design' },
            ],
            furtherReading: [
                { label: 'Fittsの法則とUIデザイン', url: 'https://www.nngroup.com/articles/fitts-law/', description: 'NNGroupによるFittsの法則のインタラクションデザインへの応用' },
            ],
        },
    },

    /* ─── 5. Trust Logic ─── */
    {
        slug: 'trust-logic',
        icon: Shield,
        color: 'bg-amber-50 text-amber-600 border-amber-100',
        dotColor: 'bg-amber-500',
        title: 'Trust Logic',
        subtitle: '信頼構築を最優先する構成',
        description: 'ファーストビューから3スクロール以内に社会的証明・実績を配置。訪問者の無意識の不安に最速で回答します。',
        metrics: 'CVR改善 +28%',
        article: {
            brain: {
                heading: '脳の仕組み：不確実性下の意思決定',
                paragraphs: [
                    'Robert Cialdini（2006）が「影響力の武器」で体系化した6つの原理の中で、LPにおいて最も強力なのは「社会的証明（Social Proof）」と「権威（Authority）」です。',
                    '人間の脳は、不確実な状況に直面すると本能的に「他の人はどうしているか？」を確認します。これは太古の生存戦略の名残です。見知らぬ森で食べ物を見つけたとき、他の動物が食べていれば「安全」と判断できる。LPにおけるレビューや導入実績は、まさにこの「他者の行動」という安全信号です。',
                    'さらに重要なのは「信頼は順序（Sequence）で構築される」という事実です。最初に「この会社は誰なのか」（Identity）、次に「他の人も使っているか」（Social Proof）、そして「具体的にどんな成果が出たか」（Evidence）。この三段階が揃わないと、訪問者のSystem 2がブレーキをかけます。',
                ],
            },
            failures: {
                heading: 'よくある失敗：信頼を壊すLP',
                items: [
                    { label: '実績ゼロの「プロ宣言」', detail: '「業界No.1」「満足度98%」——しかし調査元も母数も記載なし。根拠なき主張は信頼の最大の敵。' },
                    { label: '抽象的なレビュー', detail: '「とても良かったです！」「大満足でした！」——コピペ可能なレビューに信頼性はゼロ。「3ヶ月使って、朝起きるのが楽になった」——この具体性が信頼。' },
                    { label: '価格が先、価値が後', detail: '感情的に「欲しい」と思う前に「¥29,800」を見せるLP。まず香り、見た目、温度で「欲しい」を引き出し、その後にレジで価格を提示する。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：信頼の三段階構築法',
                items: [
                    'ファーストビュー直下にロゴバー（取引先/メディア掲載実績）を配置せよ。具体名を5社以上。',
                    'レビューには必ず「数字」「身体感覚」「Before/After」を含めよ。「利用2ヶ月で受注率が14%上昇」——脳が「リアルだ」と判定する要素。',
                    '価格提示はベネフィットの説明が完了した「後」に行え。',
                    '無条件返金保証をCTAの直下に配置せよ。System 2の最後の抵抗を排除する最強の手段。',
                ],
            },
            references: [
                { authors: 'Cialdini, R. B.', year: 2006, title: 'Influence: The Psychology of Persuasion (Revised Edition)', source: 'Harper Business', url: 'https://scholar.google.com/scholar?q=Cialdini+Influence+Psychology+Persuasion' },
                { authors: 'Fogg, B. J. et al.', year: 2001, title: 'What Makes Web Sites Credible?', source: 'CHI 2001 Proceedings', url: 'https://doi.org/10.1145/365024.365037' },
                { authors: 'Guéguen, N. & Jacob, C.', year: 2002, title: 'Social Proof, Compliance and Consumption', source: 'Journal of Applied Social Psychology, 32(7)', url: 'https://doi.org/10.1111/j.1559-1816.2002.tb00216.x' },
            ],
            furtherReading: [
                { label: '信頼性のUXデザイン', url: 'https://www.nngroup.com/articles/trustworthy-design/', description: 'NNGroupによるWebサイト信頼性の設計原則' },
            ],
        },
    },

    /* ─── 6. Frictionless Action ─── */
    {
        slug: 'frictionless-action',
        icon: Rocket,
        color: 'bg-rose-50 text-rose-600 border-rose-100',
        dotColor: 'bg-rose-500',
        title: 'Frictionless Action',
        subtitle: '意思決定の摩擦をゼロに',
        description: '感情的な納得からCTAクリックまでの心理的距離を極限まで短縮。迷いが生まれる前に行動を完了させます。',
        metrics: 'CTA到達率 +55%',
        article: {
            brain: {
                heading: '脳の仕組み：Fogg行動モデル',
                paragraphs: [
                    'スタンフォード大学のBJ Foggが提唱した行動モデル（B=MAP）は、行動(Behavior)は動機(Motivation)、能力(Ability)、きっかけ(Prompt)の3要素が同時に閾値を超えたときに発生すると説明します。',
                    'LPにおいて最も改善効果が高いのは「能力」——つまり「行動の簡便さ」の最大化です。どれだけ動機が高くても、フォーム入力が20項目あったら脳は「面倒だ」と判断し、行動は発生しません。逆に、動機がそこそこでも、ワンクリックで完了するなら行動は起きます。',
                    'もう一つ重要なのが「損失回避（Loss Aversion）」です。Kahneman & Tversky（1979）のプロスペクト理論によれば、人間は同じ量の利得よりも損失に約2倍敏感です。ただし虚偽の緊急性は信頼を破壊するため、真実に基づいた限定性のみが有効です。',
                ],
            },
            failures: {
                heading: 'よくある失敗：摩擦だらけの動線',
                items: [
                    { label: '入力項目の暴走', detail: '名前、メール、電話番号、住所、会社名、役職、従業員数、予算感、導入時期——初回接触で11項目。初回で求めるのはメールアドレス1つで十分。' },
                    { label: 'CTAの言葉が重い', detail: '「今すぐ購入する」「契約する」——心理的コミットメントが大きすぎる言葉。「無料で試してみる」「まずは覗いてみる」——入口の敷居を限界まで下げよ。' },
                    { label: '決済への道のりが長い', detail: 'CTA→新規登録→メール確認→プロフィール→プラン選択→決済→確認。7ステップ。各ステップで10%が離脱すれば、最終到達率は50%を切る。ステップは3以下に。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：行動のハードルを消し去る',
                items: [
                    'CTAのラベルを「申し込む」から「無料で始める」に変えよ。加えて「1分で完了」「クレジットカード不要」のマイクロコピーをボタン直下に。',
                    '初回取得する情報はメールアドレス1つに絞れ。残りの情報はオンボーディング中に段階的に取得する。',
                    'CTAをページ内3箇所以上に配置し、スティッキーバーでも常時表示せよ。',
                    '真実に基づく限定性を1つ追加せよ。「先着30名限定」——ただし虚偽は絶対にNG。',
                ],
            },
            references: [
                { authors: 'Fogg, B. J.', year: 2009, title: 'A Behavior Model for Persuasive Design', source: 'Persuasive Technology 2009 Proceedings', url: 'https://doi.org/10.1145/1541948.1541999' },
                { authors: 'Kahneman, D. & Tversky, A.', year: 1979, title: 'Prospect Theory: An Analysis of Decision under Risk', source: 'Econometrica, 47(2), 263–292', url: 'https://doi.org/10.2307/1914185' },
                { authors: 'Thaler, R. H. & Sunstein, C. R.', year: 2008, title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness', source: 'Yale University Press', url: 'https://scholar.google.com/scholar?q=Thaler+Sunstein+Nudge+2008' },
            ],
            furtherReading: [
                { label: 'CVR改善のためのフォーム最適化ガイド', url: 'https://www.nngroup.com/articles/web-form-design/', description: 'NNGroupによるフォーム設計のベストプラクティス' },
            ],
        },
    },

    /* ─── 7. Anchoring Effect (NEW) ─── */
    {
        slug: 'anchoring-effect',
        icon: Anchor,
        color: 'bg-teal-50 text-teal-600 border-teal-100',
        dotColor: 'bg-teal-500',
        title: 'Anchoring Effect',
        subtitle: 'アンカリング効果',
        description: '最初に提示された数字や情報が、その後のすべての判断基準を支配する。価格提示と比較設計の科学。',
        metrics: '価格納得度 +63%',
        article: {
            brain: {
                heading: '脳の仕組み：最初の数字が全てを決める',
                paragraphs: [
                    'Tversky & Kahneman（1974）が発見した「アンカリング効果」は、意思決定における最も強力で回避不可能なバイアスの一つです。人間は最初に提示された数値（アンカー）を基準点として、その後の判断を行います。この影響は、その数値が明らかに無関係であっても発生します。',
                    '彼らの有名な実験では、ルーレットで出た数字（10または65）を見た後に「国連加盟国に占めるアフリカ諸国の割合」を推定させました。ルーレットの数字は質問と無関係であるにもかかわらず、10を見たグループは平均25%、65を見たグループは平均45%と推定しました。全く無関係な数字ですら、判断の基準点になるのです。',
                    'LPにおけるアンカリングの応用は「価格戦略」だけに留まりません。「通常価格→割引価格」の比較、「競合の価格→自社の価格」の並列、「改善前→改善後」の数字の並置——すべてがアンカリングの応用です。最初に見せる数字で、すべての印象が決まります。',
                ],
            },
            failures: {
                heading: 'よくある失敗：アンカー不在の価格提示',
                items: [
                    { label: 'いきなり最安値を見せる', detail: '¥980から始めてしまうと、それがアンカーになる。上位プランの¥2,980が「3倍も高い」と感じられる。先に¥9,800のプレミアムを見せれば、¥2,980は「お得」に変わる。' },
                    { label: '比較対象のない価格', detail: '「月額¥15,000」だけを提示するLP。高いのか安いのか判断できない。「コンサルタントに依頼すると月額¥300,000。その20分の1で同等の分析が可能」——比較があって初めて価値が伝わる。' },
                    { label: '改善数値の脈絡なし', detail: '「CVR 2.3%改善」——これが凄いのかどうか、読者には分からない。「業界平均CVR 0.8%の中で、2.3%は上位3%に入る成果」——文脈がアンカーになる。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：アンカーを戦略的に設置する',
                items: [
                    '料金ページでは最も高いプランを最初（左端）に配置せよ。その価格がアンカーとなり、中間プランが「ちょうどいい」と知覚される。',
                    '割引を提示する際は、必ず元の価格を取り消し線で残せ。「¥29,800 → ¥14,900」——視覚的なアンカーが割引の大きさを伝える。',
                    '導入事例では「改善前の数字」を先に大きく見せ、次に「改善後」を提示。落差がアンカリング効果を最大化する。',
                    '競合や代替手段の価格/コストを先に提示し、その後で自社の価格を見せよ。「外注なら月50万円。このツールなら月額980円」——文脈そのものがセールスになる。',
                ],
            },
            references: [
                { authors: 'Tversky, A. & Kahneman, D.', year: 1974, title: 'Judgment under Uncertainty: Heuristics and Biases', source: 'Science, 185(4157), 1124–1131', url: 'https://doi.org/10.1126/science.185.4157.1124' },
                { authors: 'Ariely, D. et al.', year: 2003, title: '"Coherent Arbitrariness": Stable Demand Curves Without Stable Preferences', source: 'Quarterly Journal of Economics, 118(1), 73–106', url: 'https://doi.org/10.1162/00335530360535153' },
                { authors: 'Furnham, A. & Boo, H. C.', year: 2011, title: 'A Literature Review of the Anchoring Effect', source: 'The Journal of Socio-Economics, 40(1), 35–42', url: 'https://doi.org/10.1016/j.socec.2010.10.008' },
            ],
        },
    },

    /* ─── 8. Scarcity Principle (NEW) ─── */
    {
        slug: 'scarcity-principle',
        icon: Clock,
        color: 'bg-orange-50 text-orange-600 border-orange-100',
        dotColor: 'bg-orange-500',
        title: 'Scarcity Principle',
        subtitle: '希少性の原理',
        description: '「残りわずか」「期間限定」——希少性の知覚が購買意思決定を加速する心理メカニズムと、信頼を壊さない正しい活用法。',
        metrics: '即時行動率 +47%',
        article: {
            brain: {
                heading: '脳の仕組み：失うことへの恐怖',
                paragraphs: [
                    'Cialdini（2006）の「影響力の武器」における6原理の中でも、際立って即効性が高いのが「希少性（Scarcity）」です。ものが少なくなるほど、その価値は高く知覚されます。これは進化心理学的に説明可能で、食料が乏しい環境では「今すぐ確保しなければ失われる」という即時行動が生存率を高めたからです。',
                    'Worchel et al.（1975）の有名なクッキー実験では、同じクッキーを10枚入りの瓶と2枚入りの瓶から食べた被験者の評価を比較しました。結果、2枚の瓶のクッキーの方が「より美味しい」「より欲しい」と評価されました。さらに重要な発見は、「10枚から2枚に減った」条件が最も高い評価を受けたことです。つまり「減少」そのものが価値を高めるのです。',
                    '前述のKahneman & Tverskyの損失回避バイアスとの相乗効果も見逃せません。「手に入る可能性」よりも「手に入らなくなる可能性」の方が約2倍強く人を動かします。LPにおける「残り3名」や「本日23:59まで」は、まさにこのメカニズムを活用しています。',
                ],
            },
            failures: {
                heading: 'よくある失敗：嘘の希少性',
                items: [
                    { label: '永遠に続く「期間限定」', detail: '毎月リセットされるカウントダウンタイマー。一度でもユーザーに「これ前も見た」と気づかれた瞬間、サイト全体への信頼が崩壊する。虚偽の緊急性は自殺行為。' },
                    { label: '「残り○名」のインフレ', detail: '先月も先々月も「残り5名」のLP。SNSでスクリーンショットを晒された例は数知れない。虚偽表示は景品表示法に抵触するリスクも。' },
                    { label: '理由なき割引', detail: '「今だけ50%OFF」——なぜ半額なのか理由がない。理由なき割引は「定価が不当に高い」か「商品に問題がある」と解釈される。「在庫入れ替えのため」「年度末決算のため」——合理的な理由がセットで必要。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：誠実な希少性の設計',
                items: [
                    '真実の限定性のみを使え。人数制限があるなら実際の残席数を表示し、期間限定なら本当にその日に終了せよ。嘘は1回で全てを破壊する。',
                    '限定の「理由」を必ず添えよ。「講師1名で対応するため月10名が上限」——合理的理由が希少性の信頼性を担保する。',
                    '「残り僅か」の通知はメール/LINEで行動していないユーザーに送れ。LPに来ている時点で関心はある。最後の一押しは、離脱後のリマインドが最も効く。',
                    'セール終了後は本当に価格を戻せ。一度でも「終了したセールがまだやっている」事態が起きると、あなたの全てのマーケティングが嘘になる。',
                ],
            },
            references: [
                { authors: 'Worchel, S. et al.', year: 1975, title: 'Effects of Supply and Demand on Ratings of Object Value', source: 'Journal of Personality and Social Psychology, 32(5), 906–914', url: 'https://doi.org/10.1037/0022-3514.32.5.906' },
                { authors: 'Cialdini, R. B.', year: 2006, title: 'Influence: The Psychology of Persuasion', source: 'Harper Business', url: 'https://scholar.google.com/scholar?q=Cialdini+Influence+Psychology+Persuasion' },
                { authors: 'Aggarwal, P. et al.', year: 2011, title: 'Scarcity Messages', source: 'Journal of Advertising, 40(3), 19–30', url: 'https://doi.org/10.2753/JOA0091-3367400302' },
            ],
            furtherReading: [
                { label: '緊急性と希少性のUXパターン', url: 'https://www.nngroup.com/articles/creating-urgency/', description: 'NNGroupによる緊急性表現のエビデンスベース分析' },
            ],
        },
    },

    /* ─── 9. Social Proof Design (NEW) ─── */
    {
        slug: 'social-proof-design',
        icon: Users,
        color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
        dotColor: 'bg-cyan-500',
        title: 'Social Proof Design',
        subtitle: '社会的証明の設計',
        description: '他者の行動は最も強力な説得要因。レビュー、導入実績、利用者数——「みんなが使っている」のシグナルを科学的に設計する。',
        metrics: '信頼スコア +71%',
        article: {
            brain: {
                heading: '脳の仕組み：情報的社会的影響',
                paragraphs: [
                    '心理学では社会的影響を「規範的影響（Normative Influence）」と「情報的影響（Informational Influence）」に分類します。LPにおいて特に強力なのは後者です。情報的影響とは「自分では判断できない状況で、他者の行動を正しい判断の手がかりとする」メカニズムです。',
                    'Sherif（1935）の自動運動効果の実験以来、人間が不確実な状況で他者の行動に依存することは繰り返し実証されてきました。Webにおいても同様です。BrightLocal（2023）の調査では、消費者の98%がオンラインレビューを購入判断の参考にすると回答しています。',
                    '特にB2Bの高額商材では「導入事例」がSocial Proofの最強形態です。Edelman Trust Barometer（2023）によれば、B2B購買担当者の71%が「同業他社の導入事例」を意思決定の決定的要因として挙げています。抽象的な「満足度99%」より、具体的な1社の成功物語の方がはるかに強力です。',
                ],
            },
            failures: {
                heading: 'よくある失敗：逆効果のSocial Proof',
                items: [
                    { label: '顔なし・名なしのレビュー', detail: '「A.K.様（30代女性）」——匿名レビューへの信頼は急速に低下している。実名・実写真・具体的な肩書きがなければ、AIが生成したと疑われる時代。' },
                    { label: '規模の不一致', detail: '従業員10名のスタートアップのLPに「トヨタ・ソニー導入」のロゴバー。ターゲットが「自分たちとは規模が違う」と感じたら、Social Proofは逆効果になる。同業・同規模の事例を優先せよ。' },
                    { label: '量だけで質なし', detail: '「レビュー500件」と数は多いが、すべて「良かったです」級の一言。読者は「サクラか、浅い利用者ばかりでは」と疑う。10件の深いレビューの方が500件の浅いレビューに勝る。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：信じられるSocial Proofの設計',
                items: [
                    'レビューには「実名」「実写真」「具体的成果」の3要素を必須とせよ。「株式会社○○ 営業部長 田中太郎」「導入3ヶ月で新規商談数が月5件→月18件に」。',
                    'ターゲットと同じ業種・規模の導入事例を最優先で掲載せよ。「自分たちにも当てはまる」と感じた瞬間がコンバージョンの分水嶺。',
                    '利用者数を表示する場合、リアルタイムカウンターではなく「2024年12月時点: 3,847社導入」のように日時を明記せよ。',
                    'ネガティブレビューを1件混ぜよ。「セットアップに3日かかったが、慣れれば簡単」——完璧すぎるレビューへの不信感を解消する。',
                ],
            },
            references: [
                { authors: 'Sherif, M.', year: 1935, title: 'A Study of Some Social Factors in Perception', source: 'Archives of Psychology, 27(187)', url: 'https://psycnet.apa.org/record/1936-01332-001' },
                { authors: 'BrightLocal', year: 2023, title: 'Local Consumer Review Survey 2023', source: 'BrightLocal Research', url: 'https://www.brightlocal.com/research/local-consumer-review-survey/' },
                { authors: 'Edelman', year: 2023, title: '2023 Edelman Trust Barometer', source: 'Edelman Trust Institute', url: 'https://www.edelman.com/trust/trust-barometer' },
            ],
            furtherReading: [
                { label: 'レビューUIの設計ガイド', url: 'https://www.nngroup.com/articles/user-reviews/', description: 'NNGroupによるユーザーレビューの効果的な表示方法' },
            ],
        },
    },

    /* ─── 10. Narrative Transport (NEW) ─── */
    {
        slug: 'narrative-transport',
        icon: BookHeart,
        color: 'bg-pink-50 text-pink-600 border-pink-100',
        dotColor: 'bg-pink-500',
        title: 'Narrative Transport',
        subtitle: 'ナラティブ・トランスポート',
        description: '物語に「運ばれる」体験が、論理的抵抗を無効化する。ストーリーテリングがLPの説得力を根本から変える心理メカニズム。',
        metrics: '読了率 +89%',
        article: {
            brain: {
                heading: '脳の仕組み：物語への没入が防御を解除する',
                paragraphs: [
                    'Green & Brock（2000）が提唱した「Transportation Theory（トランスポーテーション理論）」は、マーケティングの世界を根本から変えた理論です。人が物語に深く没入すると「Transportation（心理的移動）」が起き、現実世界の信念・態度・行動意図が物語の方向に変化します。',
                    '重要なのは、この態度変化が「論理的説得」のメカニズムとは全く異なる経路で起きることです。論理的説得（Central Route）では、受け手が反論や批判的思考を行います。しかし物語への没入時、脳はCounter-arguing（反論生成）の機能を一時的に停止させます。つまり、ストーリーに「運ばれている」間、人間の防御シールドは下がるのです。',
                    'Zak（2014）のfMRI研究では、感情的なストーリーを聞いた被験者の脳内でオキシトシン（信頼と共感のホルモン）の分泌が増加し、その被験者は実際にストーリー内の慈善団体に寄付する確率が高かったことが確認されています。物語は文字通り、脳の化学反応を変えるのです。',
                ],
            },
            failures: {
                heading: 'よくある失敗：物語のないLP',
                items: [
                    { label: 'Feature List型のLP', detail: '「機能A、機能B、機能C...」の箇条書き。情報は正確だが、読者の感情は1ミリも動かない。人間はリストではなく物語で世界を理解する。' },
                    { label: '主人公不在の成功事例', detail: '「導入後、業務効率が30%向上しました」——誰の、どんな苦労が、どう変わったのか。主人公のいない物語はただの報告書。' },
                    { label: '完璧すぎるビフォーアフター', detail: '困難なく、葛藤なく、一直線に成功する物語。人はそれを「広告だ」と見抜く。「導入初月は社内の反対があった。しかし3ヶ月後のデータを見た反対派の部長が——」この葛藤こそが信頼を生む。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：物語の力をLPに実装する',
                items: [
                    'ヘッドラインに「主人公」を登場させよ。「このツールは」ではなく「あなたが」で始まるコピー。読者自身を物語の主人公にする。',
                    '導入事例は「問題認識→葛藤→発見→変化→結果」の5幕構成で書け。特に「葛藤」を丁寧に描写すること。完璧な成功譚は嘘くさい。',
                    '未来のシナリオを1段落で描け。「3ヶ月後のあなたは、月曜の朝に重い足取りで出社することはなくなる」——未来の自分を想像させた時点で、物語のTransportationが始まる。',
                    'コピーに五感の言葉を入れよ。「見える」「聞こえる」「感じる」「温かい」「冷たい」——身体の感覚を呼び起こす言葉がTransportationを加速する。',
                ],
            },
            references: [
                { authors: 'Green, M. C. & Brock, T. C.', year: 2000, title: 'The Role of Transportation in the Persuasiveness of Public Narratives', source: 'Journal of Personality and Social Psychology, 79(5), 701–721', url: 'https://doi.org/10.1037/0022-3514.79.5.701' },
                { authors: 'Zak, P. J.', year: 2014, title: 'Why Your Brain Loves Good Storytelling', source: 'Harvard Business Review', url: 'https://hbr.org/2014/10/why-your-brain-loves-good-storytelling' },
                { authors: 'van Laer, T. et al.', year: 2014, title: 'The Extended Transportation-Imagery Model', source: 'Journal of Consumer Research, 40(5), 797–817', url: 'https://doi.org/10.1086/673383' },
            ],
        },
    },

    /* ─── 11. Micro-Copy (NEW PATTERN) ─── */
    {
        slug: 'micro-copy',
        icon: PenTool,
        color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100',
        dotColor: 'bg-fuchsia-500',
        title: 'Micro-Copy',
        subtitle: 'マイクロコピーの魔力',
        description: 'ボタンの文言、フォームのプレースホルダー、エラーメッセージ——たった数文字の言葉がCVRを劇的に変える。小さな言葉の、大きな心理的インパクト。',
        metrics: 'フォーム完了率 +38%',
        article: {
            brain: {
                heading: '脳の仕組み：Micro-Momentの連鎖',
                paragraphs: [
                    'Googleが2015年に提唱した「Micro-Moments」の概念は、ユーザーの意思決定が1つの大きな判断ではなく、無数の小さな瞬間の連鎖であることを明らかにしました。LPにおけるマイクロコピーは、まさにこの「小さな瞬間」を設計する技術です。',
                    'CTAボタンの文言を「送信」から「無料で試してみる」に変えただけでコンバージョンが31%向上した事例（Unbounce, 2019）は有名です。なぜか？「送信」はユーザーに「何かを差し出す（失う）」という損失フレームを想起させます。一方「無料で試してみる」は「何かを得る」という獲得フレームを提示します。Kahneman & Tverskyのプロスペクト理論（1979）が示す通り、人間は損失を利得の2倍嫌います。たった5文字の違いが、この根源的なバイアスのスイッチを切り替えるのです。',
                    'さらに重要なのは「処理流暢性（Processing Fluency）」です。Alter & Oppenheimer（2009）の研究によれば、情報が「読みやすい」「処理しやすい」と感じられるほど、その情報は「真実である」「信頼できる」と知覚されます。マイクロコピーが明瞭で具体的であるほど、ユーザーは無意識レベルでそのサイトを「信頼できる」と判断します。',
                ],
            },
            failures: {
                heading: 'よくある失敗：0.5秒の判断を殺す言葉',
                items: [
                    { label: '「送信する」ボタン', detail: 'フォームの完了ボタンが「送信」「Submit」——これは技術者の言葉であり、ユーザーの言葉ではない。「無料で結果を見る」「あなた専用のレポートを受け取る」——ユーザーが得るものを言語化せよ。' },
                    { label: '空っぽのプレースホルダー', detail: 'メール入力欄に「メールアドレス」とだけ書かれたフォーム。「仕事用のメールアドレス（例: tanaka@company.co.jp）」——具体例と用途を示すことで入力の心理的ハードルが激減する。' },
                    { label: '冷酷なエラーメッセージ', detail: '「入力エラーです」「正しい形式で入力してください」——機械的な拒絶はユーザーの感情を逆なでする。「もう少しです！メールアドレスに@が含まれていないようです」——共感と具体的な修正方法がセット。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：0.5秒を支配する言葉の選び方',
                items: [
                    'CTAボタンには「ユーザーが得るもの」を書け。「登録」→「無料アカウントを作る」、「購入」→「今日から使い始める」、「ダウンロード」→「PDFガイドを受け取る」。',
                    'フォーム入力欄の下に「1分で完了」「クレジットカード不要」「いつでも解約可」のマイクロコピーを追加せよ。ユーザーのSystem 2が生成する不安を先回りして消す。',
                    'エラーメッセージには(1)共感、(2)問題の特定、(3)解決方法の3要素を含めよ。「おっと！電話番号にハイフンが入っているようです。数字のみで入力してみてください 😊」',
                    'ページ離脱時のポップアップには疑問形を使え。「本当に離れますか？」ではなく「あと30秒で診断結果が届きます。このまま確認しませんか？」——好奇心に訴えかける。',
                ],
            },
            references: [
                { authors: 'Kahneman, D. & Tversky, A.', year: 1979, title: 'Prospect Theory: An Analysis of Decision under Risk', source: 'Econometrica, 47(2), 263–292', url: 'https://doi.org/10.2307/1914185' },
                { authors: 'Alter, A. L. & Oppenheimer, D. M.', year: 2009, title: 'Uniting the Tribes of Fluency to Form a Metacognitive Nation', source: 'Personality and Social Psychology Review, 13(3), 219–235', url: 'https://doi.org/10.1177/1088868309341564' },
                { authors: 'Unbounce', year: 2019, title: 'Conversion Benchmark Report', source: 'Unbounce Research', url: 'https://unbounce.com/conversion-benchmark-report/' },
                { authors: 'Google', year: 2015, title: 'Micro-Moments: Your Guide to Winning the Shift to Mobile', source: 'Think with Google', url: 'https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/micro-moments-understand-new-consumer-behavior/' },
            ],
        },
    },

    /* ─── 12. Color Psychology (NEW PATTERN) ─── */
    {
        slug: 'color-psychology',
        icon: Palette,
        color: 'bg-lime-50 text-lime-600 border-lime-100',
        dotColor: 'bg-lime-500',
        title: 'Color Psychology',
        subtitle: '色彩心理と購買行動',
        description: '色は言語より速く脳に到達する。CTAの色、背景のトーン、コントラスト比——色彩設計がコンバージョンを左右する科学的根拠。',
        metrics: 'ブランド認知 +80%',
        article: {
            brain: {
                heading: '脳の仕組み：色は0.1秒で感情を決める',
                paragraphs: [
                    'Elliot & Maier（2014）の「Colour-in-Context Theory（色の文脈理論）」によれば、色の心理的効果は固定的ではなく、文脈に依存します。赤は「危険」にも「情熱」にもなる。重要なのは「どの色が正しいか」ではなく「その文脈で、ターゲットの脳にどの感情を引き起こすか」です。',
                    'Singh（2006）の研究では、商品の第一印象の62〜90%が色だけで決まることが示されました。さらにBottomley & Doyle（2006）は、色と商品カテゴリの「適合性」がブランド評価に決定的な影響を与えることを実証しました。高級品には黒や紺、健康食品には緑や白——この「期待される色」から逸脱すると、無意識の違和感が信頼を削ります。',
                    'LPにおいて最も重要な色彩の法則は「フォン・レストルフ効果（Von Restorff Effect, 1933）」です。均一な色彩の中で唯一異なる色の要素は、記憶に残りやすく注意を引きやすい。CTAボタンの色はページ内で「唯一の異質な色」でなければなりません。青いページに青いボタンを配置することは、ボタンを「隠す」のと同義です。',
                ],
            },
            failures: {
                heading: 'よくある失敗：色の暴力と色の不在',
                items: [
                    { label: 'レインボー配色', detail: '赤、青、緑、黄、紫——5色以上が混在するLP。脳は「どこが重要か」を処理できず、全体を「騒がしいページ」と判定して離脱する。使用する色は最大3色（ベース・アクセント・ニュートラル）。' },
                    { label: 'CTAが背景に溶ける', detail: 'ウルトラマリンブルーのページにロイヤルブルーのCTA。クリック率が低いのは「ボタンが見えない」から。修正は簡単——ページ配色の補色（反対色）をCTAに使えばいい。' },
                    { label: 'カテゴリと矛盾する色', detail: '法律事務所のLPにネオンピンク、子供向け教材に黒とゴールド。色とカテゴリの不一致は「この会社は自分たちの業界を理解していない」というシグナルになる。' },
                ],
            },
            prescription: {
                heading: '現場の処方箋：色彩で購買を導く設計',
                items: [
                    '配色は3色ルールを徹底せよ。ベースカラー60%（白/グレー）、セカンダリ30%（ブランドカラー）、アクセント10%（CTA専用）。この比率を崩した瞬間に秩序が壊れる。',
                    'CTAボタンはページ内で唯一の「異質な色」にせよ。白背景のページならオレンジ or バイオレット。ブルー系ページならオレンジ or グリーン。補色環（Color Wheel）を参照。',
                    'テキストと背景のコントラスト比を最低4.5:1に保て（WCAG 2.1 AA基準）。薄いグレー文字にグレー背景——デザイナーは美しいと感じても、ユーザーは読めない。読めないものは存在しない。',
                    '信頼を伝えるセクション（レビュー・実績・保証）には白背景+ダークテキストを使え。背景が白いほど「透明性」の印象が高まる——WEBサイトの信頼性調査でも一貫した結果。',
                ],
            },
            references: [
                { authors: 'Elliot, A. J. & Maier, M. A.', year: 2014, title: 'Color Psychology: Effects of Perceiving Color on Psychological Functioning in Humans', source: 'Annual Review of Psychology, 65, 95–120', url: 'https://doi.org/10.1146/annurev-psych-010213-115035' },
                { authors: 'Singh, S.', year: 2006, title: 'Impact of Color on Marketing', source: 'Management Decision, 44(6), 783–789', url: 'https://doi.org/10.1108/00251740610673332' },
                { authors: 'Bottomley, P. A. & Doyle, J. R.', year: 2006, title: 'The Interactive Effects of Colors and Products on Perceptions of Brand Logo Appropriateness', source: 'Marketing Theory, 6(1), 63–83', url: 'https://doi.org/10.1177/1470593106061263' },
                { authors: 'Von Restorff, H.', year: 1933, title: 'Über die Wirkung von Bereichsbildungen im Spurenfeld', source: 'Psychologische Forschung, 18, 299–342', url: 'https://doi.org/10.1007/BF02409636' },
            ],
            furtherReading: [
                { label: 'CTAボタンの色彩テスト結果', url: 'https://www.nngroup.com/articles/cta-buttons/', description: 'NNGroupによるCTAボタンのデザイン・色彩テスト分析' },
            ],
        },
    },
]

/* ═══════════════════════════════════════════════
   Other exports (unchanged)
   ═══════════════════════════════════════════════ */

export const SCAN_MESSAGES = [
    '入力データを受信。解析プロトコル SATORI v2.2 を起動中...',
    '視線誘導（Eye-Tracking）パスのシミュレーションを実行中...',
    '認知負荷（Cognitive Load）の定量的スコアリングを適用中...',
    'Fogg行動モデルに基づくコンバージョン摩擦を定量化中...',
    '行動経済学モデルに基づく成約率の予測アルゴリズムを適用中...',
    '10,000時間の現場データとの照合を完了。統計的有意性を検証中...',
    '最終レポートを生成中——全解析エンジンの結果を統合しています...',
]

export const MOCK_SCORE = 32

export const MOCK_RESULT = {
    exposed: {
        title: 'ファーストビューにおける「自分事化」の不足',
        finding: '現在のヘッドライン「理想の身体を手に入れよう」は、ターゲット層（30代女性）にとって既視感の高い表現です。行動経済学の「情報フィルタリング」の観点から、脳はこれを「既知の広告パターン」として処理し、0.3秒以内に注意の対象外とする傾向があります。',
        recommendation: '店頭で売れる商品に学ぶと、「おいしいおにぎり」ではなく「店長が3回試作した自慢の具」のように、具体性と温度のある言葉が足を止めます。ターゲットが日常で感じている微細な感情に寄り添う表現へ変えることで、注意の獲得率は大きく改善します。',
        improvedCopy: '「今の自分も好きになりたい」——仕事帰りの鏡でため息をつくあなたへ贈る、3ヶ月の物語。',
        relatedInsight: 'cognitive-load',
    },
    locked: [
        { title: '信頼構築と価格提示の順序設計' },
        { title: '社会的証明（レビュー）のリアリティ向上' },
        { title: 'CTA周辺のマイクロコピーと心理的安全性' },
        { title: 'モバイル表示時の情報優先度の再構成' },
    ],
}

export const NAV_ITEMS = [
    { id: 'insights', label: 'Insights' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'results', label: 'Results' },
]
