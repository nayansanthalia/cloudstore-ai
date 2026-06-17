import type { CloudFile } from '@/types'

export const MOCK_FILES: CloudFile[] = [
  // ─── Invoices ───────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Invoice_Reliance_Jan2024.pdf',
    folder: 'Invoices',
    type: 'pdf',
    size: '245 KB',
    sizeBytes: 250880,
    date: 'Jan 15, 2024',
    dateISO: '2024-01-15',
    tags: ['invoice', 'reliance', 'infrastructure', 'cloud'],
    content:
      'Invoice from Reliance Industries for cloud infrastructure services. Amount: ₹15,500. GST: ₹2,790. Total payable: ₹18,290. Due date: February 15, 2024. Project reference: Digital Transformation Phase 2. Payment method: Bank transfer. Invoice number: REL-2024-001.',
  },
  {
    id: 2,
    name: 'Invoice_TCS_Feb2024.pdf',
    folder: 'Invoices',
    type: 'pdf',
    size: '189 KB',
    sizeBytes: 193536,
    date: 'Feb 10, 2024',
    dateISO: '2024-02-10',
    tags: ['invoice', 'tcs', 'software', 'development'],
    content:
      'Invoice from TCS Consulting for software development services. Amount: ₹8,500. GST: ₹1,530. Total payable: ₹10,030. Project: Mobile App Backend development. Payment terms: 30 days net. Invoice number: TCS-2024-089.',
  },
  {
    id: 3,
    name: 'Invoice_Infosys_Mar2024.pdf',
    folder: 'Invoices',
    type: 'pdf',
    size: '312 KB',
    sizeBytes: 319488,
    date: 'Mar 22, 2024',
    dateISO: '2024-03-22',
    tags: ['invoice', 'infosys', 'ai', 'ml', 'development'],
    content:
      'Invoice from Infosys Limited for AI and ML model development and deployment services. Amount: ₹22,000. GST: ₹3,960. Total payable: ₹25,960. Project: Customer Churn Prediction Model. Due date: April 22, 2024. Invoice number: INF-2024-0312.',
  },
  {
    id: 4,
    name: 'Invoice_Wipro_Jan2024.pdf',
    folder: 'Invoices',
    type: 'pdf',
    size: '201 KB',
    sizeBytes: 205824,
    date: 'Jan 28, 2024',
    dateISO: '2024-01-28',
    tags: ['invoice', 'wipro', 'support', 'maintenance', 'retainer'],
    content:
      'Invoice from Wipro Technologies for IT support and maintenance retainer services. Amount: ₹6,200 per month. GST: ₹1,116. Total payable: ₹7,316. Monthly retainer covering 3 months: January to March 2024. Invoice number: WIP-2024-01.',
  },
  {
    id: 5,
    name: 'Invoice_HCL_Apr2024.pdf',
    folder: 'Invoices',
    type: 'pdf',
    size: '178 KB',
    sizeBytes: 182272,
    date: 'Apr 5, 2024',
    dateISO: '2024-04-05',
    tags: ['invoice', 'hcl', 'migration', 'cloud', 'aws', 'azure'],
    content:
      'Invoice from HCL Technologies for cloud migration consulting services. Amount: ₹31,000. GST: ₹5,580. Total payable: ₹36,580. Scope: One-time migration from AWS to Azure covering 50 production servers. Timeline: 6 weeks. Invoice number: HCL-2024-004.',
  },

  // ─── Resumes ────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Resume_Priya_Sharma.pdf',
    folder: 'Resumes',
    type: 'pdf',
    size: '156 KB',
    sizeBytes: 159744,
    date: 'Mar 15, 2024',
    dateISO: '2024-03-15',
    tags: ['resume', 'data-science', 'python', 'ml', 'tensorflow'],
    content:
      'Priya Sharma — Senior Data Scientist with 5 years of experience at top MNCs. Core skills: Python, TensorFlow, PyTorch, scikit-learn, SQL, Apache Spark, Pandas, NumPy. Education: IIT Mumbai M.Tech Computer Science. Key projects: Customer segmentation model, NLP chatbot with 92% accuracy, product recommendation engine. Publications: 2 IEEE papers on deep learning. Current CTC: ₹22 LPA. Notice period: 30 days.',
  },
  {
    id: 7,
    name: 'Resume_Rahul_Gupta.pdf',
    folder: 'Resumes',
    type: 'pdf',
    size: '143 KB',
    sizeBytes: 146432,
    date: 'Mar 18, 2024',
    dateISO: '2024-03-18',
    tags: ['resume', 'fullstack', 'javascript', 'react', 'nodejs'],
    content:
      'Rahul Gupta — Full Stack Developer with 4 years of experience. Core skills: JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Redis, AWS, Docker. Education: NIT Trichy B.Tech CSE. Key projects: E-commerce platform handling 10K concurrent users, real-time analytics dashboard, mobile application with 50K downloads. Current CTC: ₹18 LPA. Notice period: 15 days.',
  },
  {
    id: 8,
    name: 'Resume_Anjali_Singh.pdf',
    folder: 'Resumes',
    type: 'pdf',
    size: '168 KB',
    sizeBytes: 172032,
    date: 'Mar 20, 2024',
    dateISO: '2024-03-20',
    tags: ['resume', 'ml-engineer', 'python', 'kubernetes', 'mlops'],
    content:
      'Anjali Singh — ML Engineer with 3 years of experience specializing in production ML systems. Core skills: Python, Keras, TensorFlow, OpenCV, Docker, Kubernetes, GCP, MLflow, Kubeflow. Education: IISc Bangalore M.Sc Artificial Intelligence. Key projects: Computer vision pipeline processing 1M images/day, MLOps automation framework, model optimization reducing inference latency by 40%. Current CTC: ₹19 LPA. Notice period: 60 days.',
  },
  {
    id: 9,
    name: 'Resume_Vikram_Patel.pdf',
    folder: 'Resumes',
    type: 'pdf',
    size: '134 KB',
    sizeBytes: 137216,
    date: 'Mar 25, 2024',
    dateISO: '2024-03-25',
    tags: ['resume', 'backend', 'java', 'kafka', 'microservices'],
    content:
      'Vikram Patel — Senior Backend Engineer with 6 years of experience in high-scale distributed systems. Core skills: Java, Spring Boot, Apache Kafka, PostgreSQL, Redis, Elasticsearch, Docker, Kubernetes, gRPC. Education: BITS Pilani B.Tech. Key projects: Payment gateway processing 5M transactions/day, order management microservices system, API gateway with 99.99% uptime. Current CTC: ₹28 LPA. Notice period: 90 days.',
  },
  {
    id: 10,
    name: 'Resume_Neha_Krishnan.pdf',
    folder: 'Resumes',
    type: 'pdf',
    size: '161 KB',
    sizeBytes: 164864,
    date: 'Mar 28, 2024',
    dateISO: '2024-03-28',
    tags: ['resume', 'devops', 'kubernetes', 'aws', 'terraform'],
    content:
      'Neha Krishnan — DevOps / Platform Engineer with 4 years of experience in cloud-native infrastructure. Core skills: AWS, Kubernetes, Terraform, Ansible, Jenkins, Python, Prometheus, Grafana, Helm. Education: VIT Vellore B.Tech IT. Key achievements: Delivered cloud cost optimisation saving ₹50 Lakhs per year, reduced deployment time from 2 hours to 8 minutes, implemented zero-downtime blue-green deployments. Current CTC: ₹24 LPA. Notice period: 45 days.',
  },

  // ─── Reports ────────────────────────────────────────────────────────────
  {
    id: 11,
    name: 'Q4_Sales_Report_2024.xlsx',
    folder: 'Reports',
    type: 'xlsx',
    size: '1.2 MB',
    sizeBytes: 1258291,
    date: 'Apr 1, 2024',
    dateISO: '2024-04-01',
    tags: ['sales', 'q4', 'revenue', 'analytics', 'quarterly'],
    content:
      'Q4 2024 Sales Report. Total revenue: ₹4.8 Crore representing 28% year-on-year growth. Regional breakdown: Maharashtra ₹1.2 Cr, Karnataka ₹0.9 Cr, Delhi NCR ₹0.8 Cr, Tamil Nadu ₹0.6 Cr, Others ₹1.3 Cr. Product revenue: CloudStore Pro ₹2.1 Cr, Enterprise Plan ₹1.8 Cr, API tier ₹0.9 Cr. Customer churn rate: 4.2%. Net Promoter Score: 67. New enterprise customers acquired: 23. Total ARR: ₹19.2 Crore.',
  },
  {
    id: 12,
    name: 'Marketing_ROI_Q1_2024.pdf',
    folder: 'Reports',
    type: 'pdf',
    size: '892 KB',
    sizeBytes: 913408,
    date: 'Apr 10, 2024',
    dateISO: '2024-04-10',
    tags: ['marketing', 'roi', 'q1', 'campaigns', 'analytics'],
    content:
      'Marketing ROI Analysis Q1 2024. Total marketing spend: ₹45 Lakhs. Pipeline revenue generated: ₹1.8 Crore. Overall campaign ROI: 300%. Channel breakdown: LinkedIn Ads ROI 450% (spend ₹12L, revenue ₹54L), SEO/Content ROI 680% (spend ₹8L, revenue ₹54.4L), Webinars ROI 290% (spend ₹5L, revenue ₹14.5L), Google Ads ROI 180% (spend ₹10L, revenue ₹18L). Customer acquisition cost: ₹8,500 blended average.',
  },
  {
    id: 13,
    name: 'Technical_Architecture.pdf',
    folder: 'Reports',
    type: 'pdf',
    size: '2.1 MB',
    sizeBytes: 2202009,
    date: 'Feb 20, 2024',
    dateISO: '2024-02-20',
    tags: ['architecture', 'technical', 'system-design', 'rag', 'infrastructure'],
    content:
      'CloudStore AI System Architecture Document v2.0. Core stack: Pinecone serverless vector database, OpenAI text-embedding-ada-002 for embeddings, Claude 3.5 Sonnet for LLM reasoning, AWS API Gateway, S3 + Google Cloud Storage for file storage, Redis for caching. Performance metrics: handles 10,000 queries per day, P95 query latency 2.3 seconds, embedding throughput 5,000 documents/hour, system uptime 99.97%. Security: SOC2 Type II, end-to-end encryption, zero-trust network.',
  },

  // ─── Contracts ──────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Contract_Azure_Enterprise.docx',
    folder: 'Contracts',
    type: 'docx',
    size: '456 KB',
    sizeBytes: 466944,
    date: 'Jan 10, 2024',
    dateISO: '2024-01-10',
    tags: ['contract', 'azure', 'microsoft', 'enterprise', 'cloud'],
    content:
      'Microsoft Azure Enterprise Agreement. Annual contract value: ₹1.2 Crore. Services included: Azure OpenAI Service, Azure Blob Storage (100TB), Azure Kubernetes Service, Azure Monitor, Azure Active Directory P2. SLA guarantee: 99.95% uptime. Contract term: 3 years, effective January 10 2024, renewal due January 10 2027. Discount: 20% off list price. Dedicated technical account manager and 24x7 enterprise support included.',
  },
  {
    id: 15,
    name: 'NDA_TechStartup_ABC.docx',
    folder: 'Contracts',
    type: 'docx',
    size: '234 KB',
    sizeBytes: 239616,
    date: 'Feb 15, 2024',
    dateISO: '2024-02-15',
    tags: ['nda', 'legal', 'confidentiality', 'startup', 'partnership'],
    content:
      'Mutual Non-Disclosure Agreement between CloudStore AI Pvt Ltd and ABC Tech Innovations Pvt Ltd. Agreement duration: 3 years from signing date. Confidential information scope: product roadmap details, customer lists, pricing strategies, proprietary algorithms, financial data. Breach penalty clause: ₹50 Lakhs per breach. Governing law: Indian law, jurisdiction: Mumbai High Court. Signed February 15, 2024.',
  },
  {
    id: 16,
    name: 'Vendor_Agreement_AWS.docx',
    folder: 'Contracts',
    type: 'docx',
    size: '678 KB',
    sizeBytes: 694272,
    date: 'Mar 1, 2024',
    dateISO: '2024-03-01',
    tags: ['vendor', 'aws', 'partnership', 'cloud', 'agreement'],
    content:
      'AWS Partner Network (APN) Agreement. Partner tier: Advanced Technology Partner. Annual spend commitment: USD 50,000. Benefits: AWS co-sell program access, Marketplace listing, $25,000 in AWS credits, Partner training and certification support, go-to-market co-funding up to $10,000. Effective date: March 1, 2024. Dedicated AWS Partner Success Manager: Amit Kumar (amit.kumar@amazon.com).',
  },

  // ─── Projects ───────────────────────────────────────────────────────────
  {
    id: 17,
    name: 'RAG_Pipeline_Design.pdf',
    folder: 'Projects',
    type: 'pdf',
    size: '1.8 MB',
    sizeBytes: 1887436,
    date: 'Apr 15, 2024',
    dateISO: '2024-04-15',
    tags: ['rag', 'ai', 'pipeline', 'design', 'architecture', 'embeddings'],
    content:
      'RAG Pipeline Design Document for CloudStore AI. Seven-phase architecture: Phase 1 Document ingestion and parsing (PDF, DOCX, XLSX support), Phase 2 Intelligent chunking at 512 tokens with 20% overlap using sliding window, Phase 3 Embedding generation via OpenAI text-embedding-ada-002 (1536 dimensions), Phase 4 Vector storage in Pinecone with metadata filtering, Phase 5 Top-5 cosine similarity retrieval with MMR diversity, Phase 6 Cohere Rerank v3 for precision reranking, Phase 7 Claude 3.5 Sonnet for final answer generation with chain-of-thought.',
  },
  {
    id: 18,
    name: 'Product_Roadmap_2024.pptx',
    folder: 'Projects',
    type: 'pptx',
    size: '4.2 MB',
    sizeBytes: 4404019,
    date: 'Apr 20, 2024',
    dateISO: '2024-04-20',
    tags: ['roadmap', 'product', 'strategy', 'planning', '2024', '2025'],
    content:
      'CloudStore AI Product Roadmap 2024 to 2025. Q2 2024: Multi-cloud support (AWS S3 + GCS + Azure Blob), batch file processing. Q3 2024: Mobile applications (iOS + Android), voice query interface, Slack bot integration. Q4 2024: Enterprise SSO (SAML/OIDC), detailed audit logs, role-based access control, SOC2 certification. Q1 2025: On-premise deployment option, custom LLM fine-tuning, API v2 with webhooks. Annual target: 1,000 enterprise customers and ₹20 Crore ARR by December 2024.',
  },
  {
    id: 19,
    name: 'Customer_Feedback_2024.pdf',
    folder: 'Projects',
    type: 'pdf',
    size: '567 KB',
    sizeBytes: 580608,
    date: 'Apr 18, 2024',
    dateISO: '2024-04-18',
    tags: ['feedback', 'nps', 'customer-success', 'ux', 'research'],
    content:
      'Customer Feedback and UX Research Report April 2024. Survey respondents: 342 active users. Net Promoter Score: 67 (excellent). Top praised features: Query response speed 89% satisfaction, answer accuracy 84%, interface design 78%, file discovery 75%. Reported issues: Occasional hallucinations in edge cases 32%, slow processing for files above 50MB 28%, missing Slack integration 45%. Top feature requests ranked by votes: Slack integration 89 votes, API webhooks 67 votes, bulk operations 54 votes, folder sharing 48 votes.',
  },
  {
    id: 20,
    name: 'Hiring_Plan_2024.xlsx',
    folder: 'Projects',
    type: 'xlsx',
    size: '234 KB',
    sizeBytes: 239616,
    date: 'Apr 22, 2024',
    dateISO: '2024-04-22',
    tags: ['hiring', 'hr', 'headcount', 'planning', 'engineering'],
    content:
      'Engineering and Operations Hiring Plan for 2024. Q2 hires: 3 ML Engineers (₹20-28 LPA), 2 Backend Developers (₹18-25 LPA), 1 DevOps Engineer (₹20-28 LPA). Q3 hires: 2 Sales Engineers (₹15-22 LPA), 3 Frontend Developers (₹16-22 LPA), 1 Senior Product Manager (₹25-35 LPA). Q4 hires: 2 Data Scientists (₹22-30 LPA), 2 Customer Success Engineers (₹12-18 LPA). Total headcount target: 45 employees by December 2024. Current team size: 23. Annual hiring budget: ₹4.2 Crore.',
  },
]

// Pre-computed stats for the header
export const STORAGE_STATS = {
  totalFiles: MOCK_FILES.length,
  totalFolders: 5,
  totalSizeBytes: MOCK_FILES.reduce((acc, f) => acc + f.sizeBytes, 0),
  totalSizeLabel: '12.4 MB',
  indexedFiles: MOCK_FILES.length,
} as const