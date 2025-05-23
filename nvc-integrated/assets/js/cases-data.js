/**
 * cases-data.js - 非暴力沟通案例数据
 * 包含不同类型的案例，按照角色关系和沟通卡点分类
 */

// 确保window对象存在（兼容不同环境）
(function(global) {
    // 声明案例数据数组
    const casesData = [
        {
            id: "case-1",
            title: "宿舍室友使用公共空间冲突",
            context: "大学宿舍中，室友在公共区域长时间视频通话，音量较大影响他人学习和休息。",
            role: "equal",
            issue: "conflict",
            traditional: "你能不能小声点？这么晚了还吵个不停，根本没法学习也没法睡觉，太自私了！要打电话出去打，别影响别人！",
            nvc: "我注意到你在宿舍里用视频通话已经有一个多小时了，现在已经是晚上十点多。我感到有些烦躁和疲倦，因为我需要安静的环境来复习和休息。你能否考虑使用耳机或者移步到走廊或公共区域进行通话呢？",
            nvcElements: {
                observation: "你在宿舍里用视频通话已经有一个多小时了，现在已经是晚上十点多。",
                feeling: "我感到有些烦躁和疲倦",
                need: "我需要安静的环境来复习和休息",
                request: "你能否考虑使用耳机或者移步到走廊或公共区域进行通话呢？"
            }
        },
        {
            id: "case-2",
            title: "学习小组成员未完成分配任务",
            context: "小组项目中，一名成员多次未按时完成分配的任务，影响了整个小组的进度。",
            role: "equal",
            issue: "expression",
            traditional: "你为什么总是拖进度？说好的部分你一直没做，害得大家都要等你。我们的评分都要被拖累了，你能不能负责任一点？",
            nvc: "我注意到上次我们约定的周三前完成的部分，你今天周五才发给大家。我感到有些焦虑，因为我们的小组需要足够的时间来整合和修改内容。我想了解你是否遇到了什么困难，同时我希望我们能一起重新安排一个对你来说更合理的时间表，确保大家都能顺利完成任务。",
            nvcElements: {
                observation: "上次我们约定的周三前完成的部分，你今天周五才发给大家。",
                feeling: "我感到有些焦虑",
                need: "我们的小组需要足够的时间来整合和修改内容",
                request: "我想了解你是否遇到了什么困难，同时我希望我们能一起重新安排一个对你来说更合理的时间表"
            }
        },
        {
            id: "case-3",
            title: "与导师讨论论文修改意见",
            context: "导师对学生的论文提出了大量修改建议，学生认为其中一些修改会改变论文的原意。",
            role: "authority",
            issue: "expression",
            traditional: "老师，我觉得您的修改建议会改变我论文的主要论点。我认为我的原版论证逻辑更加清晰，不应该按照您说的全部修改。",
            nvc: "老师，感谢您提供的详细修改建议。当看到需要重写导论部分时，我有些担忧，因为我希望保持论文的核心论点不变。我很重视您的专业指导，同时也希望我的研究视角能够得到表达。您能否帮我理解这些修改如何增强我的论点，或者我们可以一起讨论如何在保留核心观点的同时改进论文结构吗？",
            nvcElements: {
                observation: "您提供了详细修改建议，包括重写导论部分。",
                feeling: "我有些担忧",
                need: "我希望保持论文的核心论点不变，同时也希望我的研究视角能够得到表达",
                request: "您能否帮我理解这些修改如何增强我的论点，或者我们可以一起讨论如何在保留核心观点的同时改进论文结构吗？"
            }
        },
        {
            id: "case-4",
            title: "朋友借用物品后损坏",
            context: "朋友借用了你的笔记本电脑，归还时发现有明显的外观损伤。",
            role: "equal",
            issue: "emotion",
            traditional: "你怎么把我的电脑弄成这样？这可是我花了好多钱买的，你看这里都有划痕了！下次我绝对不会再借东西给你了！",
            nvc: "当我看到电脑右侧有一道明显的划痕时，我感到很难过和失望，因为这台电脑对我来说很重要，我一直很小心地使用它。我希望了解发生了什么情况，也希望我们能一起想办法解决这个问题，比如看看能否修复或者分担维修费用。",
            nvcElements: {
                observation: "电脑右侧有一道明显的划痕",
                feeling: "我感到很难过和失望",
                need: "这台电脑对我来说很重要，我一直很小心地使用它",
                request: "我希望了解发生了什么情况，也希望我们能一起想办法解决这个问题，比如看看能否修复或者分担维修费用"
            }
        },
        {
            id: "case-5",
            title: "班级活动中的意见分歧",
            context: "作为班委会成员，你的提案被班长直接否决，没有经过讨论。",
            role: "mixed",
            issue: "conflict",
            traditional: "我们好歹是同学，你作为班长就这么独断专行吗？我的提案连讨论的机会都没有，你未免太专制了吧！",
            nvc: "在刚才的班委会上，当我提出校园文化节的活动提案后，我注意到你直接说这个方案不可行，没有让大家讨论。这让我感到沮丧和被忽视，因为我花了很多时间准备这个提案，也希望能为班级活动做贡献。你能否告诉我为什么认为这个提案不可行？我希望我们能开放地讨论各种可能性，让每个人的声音都能被听到。",
            nvcElements: {
                observation: "在班委会上，当我提出校园文化节的活动提案后，你直接说这个方案不可行，没有让大家讨论",
                feeling: "我感到沮丧和被忽视",
                need: "我希望能为班级活动做贡献，希望每个人的声音都能被听到",
                request: "你能否告诉我为什么认为这个提案不可行？我希望我们能开放地讨论各种可能性"
            }
        },
        {
            id: "case-6",
            title: "图书馆学习区噪音问题",
            context: "在图书馆学习时，附近的同学一直小声交谈，影响你的专注度。",
            role: "equal",
            issue: "conflict",
            traditional: "嘿，这里是图书馆，不是聊天室！你们能不能安静点，影响别人学习了！",
            nvc: "你们好，我注意到你们在过去的半小时里一直在交谈。我现在感到有些分心和焦虑，因为我需要安静的环境来准备明天的考试。你们能否降低音量或者移到讨论区继续你们的交流呢？",
            nvcElements: {
                observation: "你们在过去的半小时里一直在交谈",
                feeling: "我感到有些分心和焦虑",
                need: "我需要安静的环境来准备明天的考试",
                request: "你们能否降低音量或者移到讨论区继续你们的交流呢？"
            }
        },
        {
            id: "case-7",
            title: "被误解为未完成小组任务",
            context: "小组项目中，组长指责你没有完成分配的任务，但实际上你已经按时提交了。",
            role: "mixed",
            issue: "expression",
            traditional: "你怎么能说我没交？我明明已经发到群里了，你是不是根本没看就来指责我？这太不公平了！",
            nvc: "当你在群里说我没有提交PPT部分时，我感到困惑和委屈，因为我昨天晚上10点就已经发送到了我们的邮件组。可能是由于某些原因你没有看到。我重视我们小组的工作，也希望能按时完成我的部分。我可以立即重新发送一份给你，你能告诉我你喜欢接收文件的方式吗？",
            nvcElements: {
                observation: "你在群里说我没有提交PPT部分",
                feeling: "我感到困惑和委屈",
                need: "我重视我们小组的工作，也希望能按时完成我的部分",
                request: "我可以立即重新发送一份给你，你能告诉我你喜欢接收文件的方式吗？"
            }
        },
        {
            id: "case-8",
            title: "与教授讨论成绩评定",
            context: "期中考试后，你认为自己的答案是正确的，但被教授标记为错误。",
            role: "authority",
            issue: "expression",
            traditional: "教授，我的第三题答案明明是对的，为什么被您标记为错误？我认为我应该得到这部分的分数。",
            nvc: "教授，我仔细检查了我的期中考试答卷，特别是第三题关于热力学第二定律的应用。当我看到这题被标记为错误时，我感到困惑，因为我的解题思路似乎与课本示例相符。我希望能够理解我的答案哪里出了问题，以便我能改进我的理解。您是否有时间和我一起看一下这个问题，帮我澄清我的理解误区？",
            nvcElements: {
                observation: "我的期中考试第三题关于热力学第二定律的应用被标记为错误",
                feeling: "我感到困惑",
                need: "我希望能够理解我的答案哪里出了问题，以便我能改进我的理解",
                request: "您是否有时间和我一起看一下这个问题，帮我澄清我的理解误区？"
            }
        },
        {
            id: "case-9",
            title: "室友作息时间冲突",
            context: "你的室友经常熬夜，深夜开灯和发出噪音影响你的睡眠。",
            role: "equal",
            issue: "emotion",
            traditional: "你能不能考虑一下别人的感受？每天晚上都这么吵，灯也开着，我根本没法睡觉！你太自私了！",
            nvc: "我注意到这周你几乎每天都在凌晨1点后还开着灯和使用键盘。当这种情况发生时，我的睡眠质量受到影响，早上起来感到特别疲惫和烦躁，因为我需要充足的睡眠来保持白天的精力。你能否在晚上11点后使用台灯而不是顶灯，或者考虑在公共区域完成你的夜间工作？我很乐意一起找到既能满足你工作需求又能保障我睡眠的方法。",
            nvcElements: {
                observation: "这周你几乎每天都在凌晨1点后还开着灯和使用键盘",
                feeling: "我感到特别疲惫和烦躁",
                need: "我需要充足的睡眠来保持白天的精力",
                request: "你能否在晚上11点后使用台灯而不是顶灯，或者考虑在公共区域完成你的夜间工作？"
            }
        },
        {
            id: "case-10",
            title: "小组讨论中被打断",
            context: "在小组讨论中，一位组员频繁打断你的发言，让你无法完整表达观点。",
            role: "equal",
            issue: "emotion",
            traditional: "你能不能让我把话说完？你总是打断别人说话，根本没人能说得下去！",
            nvc: "在刚才的讨论过程中，我注意到当我还在表达关于项目方向的想法时，有三次我的话被打断了。这让我感到有些失落和沮丧，因为我希望能够完整地分享我的想法，也相信每个人的观点都对项目有价值。我们能否约定一个规则，让每个人都有机会不被打断地完成自己的发言，然后再进行讨论？",
            nvcElements: {
                observation: "在刚才的讨论过程中，当我还在表达关于项目方向的想法时，有三次我的话被打断了",
                feeling: "我感到有些失落和沮丧",
                need: "我希望能够完整地分享我的想法，也相信每个人的观点都对项目有价值",
                request: "我们能否约定一个规则，让每个人都有机会不被打断地完成自己的发言，然后再进行讨论？"
            }
        },
        {
            id: "case-11",
            title: "请求教授延长论文提交期限",
            context: "由于突发健康问题，你需要向教授申请延长论文提交期限。",
            role: "authority",
            issue: "request",
            traditional: "教授，我生病了没法按时完成论文，您能给我延期吗？这次情况特殊，希望您能理解。",
            nvc: "教授您好，我原计划在本周五提交期末论文，但上周末我突然发高烧住院了三天（我可以提供医院证明）。虽然我已经完成了论文的大部分内容，但我担心在当前状态下赶完剩余部分会影响论文质量。我非常重视这门课程，希望能提交一份充分反映我能力和努力的作品。我想请问是否可能将提交截止日期延长至下周二？这将给我足够的时间在恢复健康的状态下完成剩余工作。",
            nvcElements: {
                observation: "我原计划在本周五提交期末论文，但上周末我突然发高烧住院了三天",
                feeling: "我担心在当前状态下赶完剩余部分会影响论文质量",
                need: "我非常重视这门课程，希望能提交一份充分反映我能力和努力的作品",
                request: "我想请问是否可能将提交截止日期延长至下周二？"
            }
        },
        {
            id: "case-12",
            title: "宿舍公共区域清洁问题",
            context: "宿舍的厨房和客厅长期由你一人清理，其他室友很少参与打扫。",
            role: "equal",
            issue: "conflict",
            traditional: "为什么公共区域总是我一个人打扫？你们都不知道清理自己的东西吗？这样真的很不公平！",
            nvc: "我注意到过去两个月里，厨房和客厅的清洁工作主要由我完成，包括每周拖地和清理冰箱。这种情况让我感到有些疲惫和不被重视，因为我认为我们共同的生活空间应该由所有人一起维护。我希望我们能制定一个清洁值日表，公平分配打扫任务，这样每个人都能承担适当的责任，同时确保公共区域的整洁。你们觉得这个建议如何？",
            nvcElements: {
                observation: "过去两个月里，厨房和客厅的清洁工作主要由我完成，包括每周拖地和清理冰箱",
                feeling: "我感到有些疲惫和不被重视",
                need: "我认为我们共同的生活空间应该由所有人一起维护",
                request: "我希望我们能制定一个清洁值日表，公平分配打扫任务，这样每个人都能承担适当的责任"
            }
        },
        {
            id: "case-13",
            title: "社团活动中的创意被否决",
            context: "在社团策划活动时，你提出的创新点子被负责人直接否决，没有得到充分考虑。",
            role: "authority",
            issue: "emotion",
            traditional: "你总是这样否决新想法，我提的建议连考虑都不考虑就被拒绝，这个社团根本不开放！",
            nvc: "在今天的策划会上，当我提出使用沉浸式体验设计活动时，我注意到你很快就表示这个想法不可行。这让我感到有些气馁和失望，因为我花了很多时间研究和准备这个提案，也相信这种新方式可能会吸引更多同学参与。我想了解你对这个提案的具体顾虑是什么，同时希望有机会更详细地解释我的想法和应对可能的挑战。可以请你分享一下你的考虑，以及我们是否可以找个时间进一步讨论这个提案吗？",
            nvcElements: {
                observation: "在今天的策划会上，当我提出使用沉浸式体验设计活动时，你很快就表示这个想法不可行",
                feeling: "我感到有些气馁和失望",
                need: "我相信这种新方式可能会吸引更多同学参与",
                request: "可以请你分享一下你的考虑，以及我们是否可以找个时间进一步讨论这个提案吗？"
            }
        },
        {
            id: "case-14",
            title: "与助教讨论作业评分",
            context: "你认为助教对你的编程作业评分过低，没有考虑到你实现的附加功能。",
            role: "authority",
            issue: "expression",
            traditional: "助教，我觉得我的分数评得不公平，我做了那么多额外功能，分数却这么低，能重新给我评分吗？",
            nvc: "助教您好，我收到了上周编程作业的评分和反馈。当我看到得分是85分时，我感到有些困惑，因为我不仅完成了基本要求，还实现了数据可视化和用户认证这两个附加功能（在作业文档第三部分有详细说明）。我理解评分标准可能有特定侧重点，我想更好地了解我的实现哪些方面需要改进，以及附加功能是否被纳入考虑。您是否有时间查看一下我的这部分工作，并解释一下评分的依据？",
            nvcElements: {
                observation: "我收到了上周编程作业的评分是85分，我不仅完成了基本要求，还实现了数据可视化和用户认证这两个附加功能",
                feeling: "我感到有些困惑",
                need: "我想更好地了解我的实现哪些方面需要改进，以及附加功能是否被纳入考虑",
                request: "您是否有时间查看一下我的这部分工作，并解释一下评分的依据？"
            }
        },
        {
            id: "case-15",
            title: "朋友反复取消约定",
            context: "你和朋友约好一起学习或参加活动，但对方多次在最后时刻取消。",
            role: "equal",
            issue: "emotion",
            traditional: "你怎么又取消啊？你总是这样，每次都让我白等，以后别再约我了！",
            nvc: "这是这个月第三次我们约好见面你在前一小时取消了。当这种情况发生时，我感到失望和不被重视，因为我调整了自己的计划来配合我们的约定。我理解有时会有突发情况，但我也需要我的时间被尊重。下次我们约定前，你能评估一下你是否真的有时间吗？如果你不确定，我们可以提前商量一个对我们都更灵活的安排。",
            nvcElements: {
                observation: "这是这个月第三次我们约好见面你在前一小时取消了",
                feeling: "我感到失望和不被重视",
                need: "我需要我的时间被尊重",
                request: "下次我们约定前，你能评估一下你是否真的有时间吗？如果你不确定，我们可以提前商量一个对我们都更灵活的安排"
            }
        },
        {
            id: "case-16",
            title: "室友熬夜影响睡眠质量",
            context: "大三学生，学业成绩优异，即将面临保研资格竞争。室友沉迷竞技类网游，每晚熬夜，键盘敲击声和突然喊叫影响睡眠。多次委婉提醒未见改变，失眠严重影响学习状态。",
            role: "equal",
            issue: "conflict",
            traditional: "你能不能别半夜发疯？我需要睡觉！",
            nvc: "我注意到最近三个月你经常在深夜玩游戏，键盘声和喊叫声常常在凌晨时分出现。这让我感到焦虑和疲惫，因为充足的睡眠对我备战保研非常重要。我想了解你的游戏时间安排，希望我们能找到一个既满足你游戏需求又能保证我睡眠质量的方案，比如晚上使用耳机或调整游戏时间。",
            nvcElements: {
                observation: "最近三个月你经常在深夜玩游戏，键盘声和喊叫声常常在凌晨时分出现",
                feeling: "我感到焦虑和疲惫",
                need: "充足的睡眠对我备战保研非常重要",
                request: "希望我们能找到一个既满足你游戏需求又能保证我睡眠质量的方案，比如晚上使用耳机或调整游戏时间"
            }
        },
        {
            id: "case-17",
            title: "小组成员因家庭变故退群",
            context: "作为小组协调者，你发现一位组员D多次未完成任务，被另一成员B指责后退出群聊。实际上D的外婆住院，他无法兼顾学业与家庭责任，但没有向组内说明情况。",
            role: "mixed",
            issue: "emotion",
            traditional: "你为什么擅自退群？我们的项目快到截止日期了，你必须完成你的部分！",
            nvc: "我看到你退出了小组群聊，我感到有些担忧和困惑，因为我们都希望小组项目能顺利完成。我想了解你是否遇到了什么困难，也希望知道有什么方式我能提供帮助。无论发生什么，我相信我们可以一起找到解决方案，让每个人都不会感到太大压力。",
            nvcElements: {
                observation: "你退出了小组群聊",
                feeling: "我感到有些担忧和困惑",
                need: "我们都希望小组项目能顺利完成",
                request: "我想了解你是否遇到了什么困难，也希望知道有什么方式我能提供帮助"
            }
        },
        {
            id: "case-18",
            title: "实验数据异常申请延期",
            context: "大四学生发现毕业论文实验数据与参考文献偏差高达15%，意味着要么实验设计有误，要么结论需要推翻。距离提交截止日仅剩72小时，重新实验意味着通宵赶工。导师以严格著称，曾在组会上批评延期申请的学生。",
            role: "authority",
            issue: "request",
            traditional: "教授，我的实验数据有问题，能不能给我延期几天提交论文？",
            nvc: "教授，在验证实验数据时，我发现A组结果与参考文献的偏差达到15%。这让我感到担忧，因为我希望确保论文的学术严谨性。我非常重视这项研究，不想因为赶时间而忽略数据异常。我想申请延期2天，这样我可以补充3组对照实验验证结果，同时今晚我会先提交已完成的框架和已核实的数据部分。您认为这个安排是否可行？",
            nvcElements: {
                observation: "在验证实验数据时，我发现A组结果与参考文献的偏差达到15%",
                feeling: "这让我感到担忧",
                need: "我希望确保论文的学术严谨性，不想因为赶时间而忽略数据异常",
                request: "我想申请延期2天，这样我可以补充3组对照实验验证结果，同时今晚我会先提交已完成的框架和已核实的数据部分"
            }
        },
        {
            id: "case-19",
            title: "拒绝学长临时加塞任务",
            context: "期末季，你需要完成3篇课程论文和一门核心课的pre，并正在等待查重结果。此时，学长突然要求你帮忙整理10份访谈稿，限今晚完成。学长是导师的得力助手，曾多次\"提携\"学弟学妹，但这次的请求将导致你的论文进度受影响。",
            role: "authority",
            issue: "expression",
            traditional: "学长，我现在真的很忙，没空帮你做这个。你找别人吧！",
            nvc: "学长，我非常理解您当年为导师付出的辛苦，您的敬业态度一直是我学习的榜样。目前我正面临三篇论文的查重与修改，时间安排非常紧张，这让我感到压力很大，因为我必须优先保障学业任务的顺利完成。关于访谈稿整理，我有三个建议：一是我可以分享一款语音转文字的工具，大大提高效率；二是我可以帮您联系另一位有经验的学弟；三是如果时间允许，我可以在周末帮您完成这项工作。不知您觉得哪种方案更合适？",
            nvcElements: {
                observation: "我正面临三篇论文的查重与修改，时间安排非常紧张",
                feeling: "这让我感到压力很大",
                need: "我必须优先保障学业任务的顺利完成",
                request: "我有三个建议：分享语音转文字工具、联系另一位学弟、或在周末帮您完成工作"
            }
        },
        {
            id: "case-20",
            title: "催还借出的相机",
            context: "你是一名摄影爱好者，用攒了三个月的兼职收入购入一台专业相机。好友小A以\"拍樱花\"为由借走相机已过约定归还期限，还在朋友圈晒出新作品，并暗示想再用一段时间。你本周六已约好拍摄，急需调试设备。",
            role: "equal",
            issue: "request",
            traditional: "你能不能快点把我的相机还给我？我周六要用，你已经超过约定时间了！",
            nvc: "小A，看到你用我的相机拍的樱花照片真美，很高兴它能帮你捕捉这些美好瞬间。我刚约好周六给一个模特拍人像，需要提前调试相机。我感到有些着急，因为今晚8点前我需要准备好设备。你能否在今天把相机放到小区物业的货架上？密码是你的生日，这样对你来说应该很方便取用。另外，我有一张新买的SD卡，可以送你继续创作使用。",
            nvcElements: {
                observation: "我刚约好周六给一个模特拍人像，需要提前调试相机",
                feeling: "我感到有些着急",
                need: "今晚8点前我需要准备好设备",
                request: "你能否在今天把相机放到小区物业的货架上？密码是你的生日"
            }
        },
        {
            id: "case-21",
            title: "澄清与好友的误会",
            context: "你是一名大三学生，正在备战教师资格证考试，每天泡在图书馆。三个月来，逐渐疏远了好友小B，不再主动约饭，微信也从秒回变成隔天回复。你从共同朋友处得知，小B在背后说你\"攀高枝，瞧不起人\"，而实际上你只是因为考试压力而无暇社交。",
            role: "equal",
            issue: "emotion",
            traditional: "你怎么能在背后说我坏话？我只是因为考试太忙了，根本不是瞧不起你！",
            nvc: "小B，听说你觉得我这三个月回复变慢了，好像是我不重视咱们的友谊。事实上，我教资考试已经失败了两次，自卑到不敢与人交流。面对这种情况，我感到无助和挫败，因为我既不想因学业失利而被看轻，又不希望失去和你这样知心朋友的联系。我需要老朋友的支持，而不是假装坚强。如果你愿意，我想每周末预留出固定时间和你聊天，和从前一样分享彼此的生活。",
            nvcElements: {
                observation: "听说你觉得我这三个月回复变慢了，好像是我不重视咱们的友谊",
                feeling: "我感到无助和挫败",
                need: "我需要老朋友的支持，而不是假装坚强",
                request: "我想每周末预留出固定时间和你聊天，和从前一样分享彼此的生活"
            }
        }
    ]; 

    // 通过多种方式确保数据可用性
    try {
        // 方式1: 直接赋值给window.casesData (传统浏览器环境)
        global.casesData = casesData;
        
        // 方式2: 通过事件通知数据已加载
        if (typeof document !== 'undefined') {
            const event = new CustomEvent('casesDataLoaded', { detail: { casesCount: casesData.length } });
            document.dispatchEvent(event);
        }
        
        // 方式3: 使用localStorage作为备用数据传输
        // 注意: 实际生产环境中数据量较大可能不适合此方法
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('nvc_cases_count', casesData.length.toString());
            } catch (e) {
                console.warn('无法使用localStorage存储案例计数', e);
            }
        }
        
        // 记录加载成功
        console.log('案例数据已成功加载，共 ' + casesData.length + ' 个案例'); 
    } catch (e) {
        console.error('案例数据加载出错:', e);
        // 尝试通过DOM添加错误信息
        if (typeof document !== 'undefined') {
            const errorMsg = '案例数据加载失败: ' + e.message;
            setTimeout(() => {
                const loadingEl = document.getElementById('loadingIndicator');
                if (loadingEl) {
                    loadingEl.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
                }
            }, 1000);
        }
    }
    
    // 导出案例数量，便于调试
    global.TOTAL_CASES_COUNT = casesData.length;
    
})(typeof window !== 'undefined' ? window : this); 