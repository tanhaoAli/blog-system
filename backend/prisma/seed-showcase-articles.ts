import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 取管理员作为作者；若无则取任意用户 */
async function resolveAuthorId(): Promise<number> {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) return admin.id;
  const anyUser = await prisma.user.findFirst();
  if (!anyUser) throw new Error('数据库中没有任何用户，请先注册用户或执行 seed。');
  return anyUser.id;
}

async function ensureTag(names: string[]) {
  const ids: number[] = [];
  for (const name of names) {
    const t = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    ids.push(t.id);
  }
  return ids;
}

async function ensureCategory(name: string) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

const articles: Array<{
  title: string;
  summary: string;
  cover_image: string;
  category: string;
  tags: string[];
  views: number;
  html: string;
}> = [
  {
    title: '算力即正义？与新一代 AI 基础设施的冷静对话',
    summary:
      '当模型参数与上下文窗口指数级膨胀，真正的瓶颈早已不在「会不会写 Prompt」，而在能源、互联与工程化交付的交汇处。',
    cover_image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80',
    category: '深度观点',
    tags: ['AI', '基础设施', '思辨'],
    views: 12840,
    html: `
<p><strong>前言</strong>：这不是一篇贩卖焦虑的推文，而是一份写给架构师、技术负责人与创业者的「边界清单」。</p>
<img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" alt="AI" width="100%" />
<h2>一、算力叙事背后的三个盲区</h2>
<p>我们习惯把「更大模型」等同于「更强智能」，却常常忽略：<strong>推理成本曲线</strong>、<strong>数据主权</strong>与<strong>可验证性</strong>才是企业落地的硬约束。</p>
<ul>
<li><strong>成本盲区</strong>：Token 计价只是表象，真正的账单藏在冷启动、长上下文与多轮重试里。</li>
<li><strong>合规盲区</strong>：跨境推理与日志留存，可能在一夜之间改写你的部署拓扑。</li>
<li><strong>价值盲区</strong>：没有评测闭环的「炫技 Demo」，无法通过 CFO 的第二个问题。</li>
</ul>
<h2>二、从「堆卡」到「堆系统」</h2>
<p>下一代竞争力，属于能把 <em>训练、推理、观测、回滚</em> 做成一条链路的团队。算力是燃料，而<strong>工程化与治理</strong>才是引擎。</p>
<blockquote><p>「正义」不属于显卡，而属于那些把复杂留给自己、把确定交给用户的人。</p></blockquote>
<h2>三、结语</h2>
<p>如果你正在评估自建还是托管，记住一句话：<strong>先画清楚数据流与责任边界，再谈模型选型。</strong>顺序错了，再强的算力也只是昂贵的噪音。</p>
`,
  },
  {
    title: '从单体到智能体编排：一位架构师的十年破局手记',
    summary:
      '系统从未因「技术不够新」而崩溃，却常因「边界不清、观测不足、回滚不可信」而失控。智能体时代，旧课依然成立。',
    cover_image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    category: '架构与未来',
    tags: ['架构', '工程实践', 'Agent'],
    views: 9621,
    html: `
<p>十年里我经历过三次「范式迁移」：移动化、云原生、以及今天的 <strong>Agentic Workflow</strong>。每一次喧嚣过后，沉淀下来的永远是同一套问题：<strong>状态在哪里？失败如何被看见？人类何时介入？</strong></p>
<h2>一、编排的本质是「有向无环的责任图」</h2>
<p>别把 Agent 当成黑盒魔法。把它看作一组<strong>可组合、可超时、可补偿</strong>的步骤——你的系统会立刻变得诚实。</p>
<img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" alt="network" width="100%" />
<h2>二、三条铁律（至今未过时）</h2>
<ol>
<li><strong>幂等与重试</strong>：任何可能重复触发的副作用，都必须有幂等键。</li>
<li><strong>可观测优先</strong>：没有 trace 的链路，不配谈 SLA。</li>
<li><strong>人机共驾</strong>：高风险决策必须落在「显式确认」的 UI 与审计日志里。</li>
</ol>
<h2>三、写给正在拆单体的你</h2>
<p>智能体不是拆服务的理由，<strong>清晰的业务边界</strong>才是。先让团队用同一套语言描述「成功与失败」，再让机器替你加速迭代。</p>
`,
  },
  {
    title: '为什么顶级产品，都活在「第一印象」的三秒钟里',
    summary:
      '用户不会给你第二次解释自己的机会。三秒内完成：信任建立、价值锚定与下一步召唤——这是体验设计的「物理极限」。',
    cover_image:
      'https://images.unsplash.com/photo-1559027615-cd462890eca1?auto=format&fit=crop&w=1600&q=80',
    category: '产品思维',
    tags: ['产品', '体验设计', '增长'],
    views: 15402,
    html: `
<p>我见过太多团队把预算砸在「第 10 屏的动效」上，却放任首屏信息密度失控。<strong>第一印象不是美术问题，而是叙事问题。</strong></p>
<h2>一、三秒内的三件事</h2>
<ul>
<li><strong>我是谁</strong>：一句话说清身份与场景，不要让用户猜。</li>
<li><strong>为什么是你</strong>：用可验证的社会证明替代形容词堆砌。</li>
<li><strong>下一步是什么</strong>：单一主 CTA，其余全部降级为次级入口。</li>
</ul>
<img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="analytics" width="100%" />
<h2>二、克制是更高级的奢华</h2>
<p>留白、对齐与节奏感，传递的是<strong>自信</strong>。堆满功能的首页，往往暴露的是<strong>战略犹豫</strong>。</p>
<blockquote><p>好产品让用户觉得自己很聪明；平庸产品让用户觉得自己在考试。</p></blockquote>
<h2>三、可执行的自检表</h2>
<p>用手机 4G 打开你的产品：首屏是否在 1.5s 内可交互？主按钮拇指是否可达？若答案是否定的，请先别讨论「品牌升级」。</p>
`,
  },
  {
    title: '代码可以替换，品味无法自动化',
    summary:
      '在生成式工具普及的今天，「写得多快」正在贬值；「删得多准」「命名多诚实」「抽象多克制」正在升值。',
    cover_image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    category: '技术人文',
    tags: ['工程文化', '品味', 'AI 辅助编程'],
    views: 8873,
    html: `
<p>工具能替你补全语法，却不能替你承担<strong>命名背后的责任</strong>。品味不是审美偏好，而是<strong>对复杂度的道德判断</strong>。</p>
<h2>一、好品味的三个信号</h2>
<ol>
<li><strong>删除的勇气</strong>：能合并的模块绝不复制粘贴。</li>
<li><strong>命名的诚实</strong>：<code>getUserById</code> 比 <code>handleData</code> 更接近真相。</li>
<li><strong>抽象的克制</strong>：只为真实出现的重复抽象，不为「未来可能」预支复杂度。</li>
</ol>
<img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" alt="code" width="100%" />
<h2>二、与 AI 结对编程的边界</h2>
<p>把 AI 当作实习生：它擅长草稿与检索，你负责<strong>评审、取舍与背锅</strong>。当你不再阅读它生成的每一行，你就从作者退化成观众。</p>
<h2>三、结语</h2>
<p>十年后，人们会忘记你用过什么框架，但会记得你留下的系统是否<strong>可被信任、可被交接、可被演进</strong>。</p>
`,
  },
  {
    title: '当延迟逼近毫秒：实时系统设计的五条铁律',
    summary:
      '从金融风控到协同编辑，「快」不是优化出来的，而是架构阶段就写进约束里的。这里有五条反复验证过的工程铁律。',
    cover_image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    category: '工程实践',
    tags: ['性能', '实时系统', '后端'],
    views: 7230,
    html: `
<p>延迟是用户体验的「硬通货」。当 P99 从百毫秒压到个位数，你面对的不是调参技巧，而是<strong>数据局部性、排队论与失败语义</strong>的总账。</p>
<h2>铁律 1：先量再砍</h2>
<p>没有火焰图与 trace 的优化，都是玄学。把瓶颈画在白板上，再谈缓存与异步。</p>
<h2>铁律 2：热路径拒绝「顺便」</h2>
<p>热路径上的 JSON 反射、动态分配与跨 AZ 调用，都是账。该内联的内联，该就近的就近。</p>
<img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80" alt="server" width="100%" />
<h2>铁律 3～5（浓缩版）</h2>
<ul>
<li><strong>背压优于丢弃</strong>：告诉上游「我满了」，比默默丢包更专业。</li>
<li><strong>超时是契约</strong>：默认值等于没有值。</li>
<li><strong>降级要可演练</strong>：没跑过故障演练的降级开关，等于不存在。</li>
</ul>
<blockquote><p>毫秒级不是炫技，是对用户注意力的尊重。</p></blockquote>
`,
  },
  {
    title: '2026 开发者生存图鉴：从写代码到设计「认知接口」',
    summary:
      'IDE 里的光标不会消失，但它的含义正在改写：你输出的不仅是语法树，而是人与机器、机器与机器之间可协作的语义层。',
    cover_image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    category: '趋势研判',
    tags: ['职业成长', 'AI', '未来工作'],
    views: 20156,
    html: `
<p>如果用一个词概括未来五年的核心能力，我会选：<strong>认知接口设计</strong>——把模糊意图翻译成可执行、可验证、可回滚的结构化任务。</p>
<h2>一、三种「接口」正在合并</h2>
<ul>
<li><strong>人机接口</strong>：提示词、工作流与可视化编排。</li>
<li><strong>机机接口</strong>：MCP、工具协议与策略沙箱。</li>
<li><strong>组织接口</strong>：评审门禁、合规审计与知识沉淀。</li>
</ul>
<img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80" alt="team" width="100%" />
<h2>二、从「我会用」到「我敢负责」</h2>
<p>工具链会指数级翻新，但<strong>责任模型</strong>不会。能定义成功标准、能复盘失败样本、能把经验写成可复用规则的人，会获得超额回报。</p>
<h2>三、给你的行动清单</h2>
<p>本周只做一件事：挑一个真实业务场景，写出它的 <strong>输入 / 输出 / 约束 / 失败模式</strong> 四象限。你会发现，所谓「AGI 焦虑」里，有一半只是文档没写清。</p>
`,
  },
];

async function main() {
  const authorId = await resolveAuthorId();
  console.log('作者 user id:', authorId);

  for (const a of articles) {
    const dup = await prisma.article.findFirst({ where: { title: a.title } });
    if (dup) {
      console.log('已存在，跳过:', a.title);
      continue;
    }

    const cat = await ensureCategory(a.category);
    const tagIds = await ensureTag(a.tags);

    const created = await prisma.article.create({
      data: {
        title: a.title,
        summary: a.summary,
        content: a.html.trim(),
        cover_image: a.cover_image,
        views: a.views,
        author_id: authorId,
        category_id: cat.id,
        tags: {
          create: tagIds.map((tag_id) => ({ tag_id })),
        },
      },
    });
    console.log('已发布:', created.id, created.title);
  }

  console.log('完成：共插入', articles.length, '篇展示文章。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
