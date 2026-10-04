---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

I am currently a PhD student in the Department of Data Science and AI at Monash University, luckily advised by Prof. [Tien-Tsin Wong](https://ttwong12.github.io/) and Prof. [Jianfei Cai](https://jianfei-cai.github.io/). I received B.S. and M.Phil. in Computer Science from Beijing Jiaotong University.

I am interested in Image/Video Generation and World Models.


# 📖 Education
- *2024.11 - now*, Doctor of Philosophy, Department of Data Science and AI, Monash University, Melbourne.
- *2020.06 - 2024.06*, Master of Computer Science, School of Computer and Information Technology, Beijing Jiaotong University, Beijing.
- *2016.09 - 2020.06*, Bachelor of Computer Science, School of Computer and Information Technology, Beijing Jiaotong University, Beijing.

<!-- # 💻 Internships
- *2022.05 - 2024.06*, Research Intern, Cognitive Computing Lab, [Baidu Research](http://research.baidu.com/).
- *2020.10 - 2022.01*, Visiting Student, [Han lab](https://cqb.pku.edu.cn/hanlab/), PKU. -->

# 🔥 News

<div class='news-box' markdown="1">

- *2026.10*: &nbsp;🔥 We release [Oneira](https://madaoer.github.io/projects/oneira/), an open-world interaction video world model.
- *2026.06*: &nbsp;🎉 One paper [ATA](https://arxiv.org/abs/2608.28082) is accepted by ECCV 2026.
- *2025.09*: &nbsp;🔥 We release the [HunyuanImage 3.0 Technical Report](https://arxiv.org/abs/2509.23951).
- *2025.06*: &nbsp;🎉 One paper [VLIPP](https://madaoer.github.io/projects/physically_plausible_video_generation/) is accepted by ICCV 2025.
- *2024.01*: &nbsp;🎉 One paper [Neural Field Classifier](https://openreview.net/pdf?id=9NqC72m31m) is accepted by ICLR 2024.
- *2023.08*: &nbsp;🎉 [SDFStudio](https://github.com/autonomousvision/sdfstudio) has supported [S3IM](https://github.com/Madaoer/S3IM-Neural-Fields).
- *2023.08*: &nbsp;🔥 We release [S3IM](https://github.com/Madaoer/S3IM-Neural-Fields)(⭐️200+). 
- *2023.07*: &nbsp;🎉 One paper [S3IM](https://arxiv.org/abs/2308.07032) is accepted by ICCV 2023.

</div>

# 📝 Publications and Manuscripts

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">arXiv 2026</div><img src='/images/oneira_fig.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [Oneira: From Open-Ended Generation to Open-World Interaction in Video World Models.](https://arxiv.org/abs/2610.01614)
  
  **Xindi Yang**, Baolu Li, Liam Lee, Zhenfei Yin, Songxin Zhang, Zhuoyang Song, Xu Jia, Jianfei Cai, Tien-Tsin Wong, Bingyi Jing, Mengyue Yang.
  
  [**Project**](https://madaoer.github.io/projects/oneira/) [**Code**](https://github.com/Madaoer/Oneira)
  - Oneira is an interactive video world model built around an explicit world state managed by a coding agent. It enables instance-level interaction with objects that emerge during open-world exploration, and the consequences of each interaction persist across long horizons.
  </div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ECCV 2026</div><img src='/images/ata_fig.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [Attribute Token Arithmetic: Disentangled and Continuous Semantic Control for Visual Autoregressive Models.](https://arxiv.org/abs/2608.28082)
  
  **Xindi Yang**, Yicheng Wu, Cheng Zhang, Jianfei Cai, Tien-Tsin Wong.
  
  [**arXiv**](https://arxiv.org/abs/2608.28082)
  - ATA finds attribute directions (e.g., aging, fatness, emotion) in the latent space of a pretrained visual autoregressive model from a single reference image, enabling disentangled, continuous and composable attribute control without retraining.
  </div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Technical Report</div><img src='/images/hunyuanimage3_fig.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [HunyuanImage 3.0 Technical Report.](https://arxiv.org/abs/2509.23951)
  
  **Core Contributor**
  
  [**arXiv**](https://arxiv.org/abs/2509.23951) [**Code**](https://github.com/Tencent-Hunyuan/HunyuanImage-3.0)
  - Hunyuan Foundation Model.
  </div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICCV 2025</div><img src='/images/vlipp_fig.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [VLIPP: Towards Physically Plausible Video Generation with Vision and Language Informed Physical Prior.](https://arxiv.org/abs/2503.23368)
  
  **Xindi Yang**\*, Baolu Li\*, Yiming Zhang, Zhenfei Yin, Lei Bai, Liqian Ma, Zhiyong Wang, Jianfei Cai, Tien-Tsin Wong, Huchuan Lu, Xu Jia (\*equal contribution).
  
  [**Project**](https://madaoer.github.io/projects/physically_plausible_video_generation/) [**Code**](https://github.com/Madaoer/VLIPP)
  - VLIPP is a two-stage image-to-video generation framework that explicitly incorporates physics with vision and language informed physical prior.
  </div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICLR 2024</div><img src='/images/paper2_fig.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [Neural Field Classifiers via Target Encoding and Classification Loss.](https://openreview.net/pdf?id=9NqC72m31m)
  
  **Xindi Yang**, Zeke Xie, Xiong Zhou, Boyu Liu, Buhua Liu, Yi Liu, Haoran Wang, Yunfeng Cai, Mingming Sun.
  
   <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>
  - Neural Field Classifiers via Target Encoding and Classification Loss can significantly outperform the standard regression-based neural field counterparts.
  </div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICCV 2023</div><img src='/images/paper_img2_500x300.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  [S3IM: Stochastic Structural SIMilarity and Its Unreasonable Effectiveness for Neural Fields.](https://openaccess.thecvf.com/content/ICCV2023/papers/Xie_S3IM_Stochastic_Structural_SIMilarity_and_Its_Unreasonable_Effectiveness_for_Neural_ICCV_2023_paper.pdf)
  
  Zeke Xie\*, **Xindi Yang**\*, Yujie Yang, Qi Sun, Yixiang Jiang, Haoran Wang, Yunfeng Cai, Mingming Sun (\*equal contribution).
  
  [**Project**](https://madaoer.github.io/s3im_nerf/) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>
  - S3IM is a plug-and-play loss, effective and robust in various difficult tasks.
  - **Academic Impact**: Our work has been featured by 4+ media and forums, such as [知乎](https://www.zhihu.com/question/614056414/answer/3244688928), [极世平台](https://mp.weixin.qq.com/s/GZnnX1lmenvpT2kN0SaWqA) 
  </div>
</div>

<!-- <div class='paper-box'><div class='paper-box-image'><div><div class="badge">Science China Life Sciences 2024</div><img src='/images/paper_img3_500x300.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">
  
  Coordinate-Wise Monotonic Transformations for Privacy Preserving Facial Age Estimation.
  
  Xinyu Yang, Runhan Li, **Xindi Yang**, Yong Zhou, Yi Liu, Jing-Dong J. Han.
  
   <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>
  - We present an approach for facial data masking that preserves age-related features using coordinate-wise monotonic
transformations.
  </div>
</div> -->

# 🎖 Honors and Awards
- *2023*, **Outstanding Intern** of the Year, Baidu Research
- *2016-2022*, Model Student of Academic Records of Beijing Jiaotong University
- *2018*, National Contemporary Undergraduate Mathematical Contest IN Modeling in China, **First Prize** in Beijing region 

# 📝 Academic Service
- Journal Review: IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), IEEE Transactions on Visualization and Computer Graphics (TVCG), Computer Graphics Forum (CGF)
- Conference Review: ICLR, NeurIPS, ICCV, ECCV, CVPR
