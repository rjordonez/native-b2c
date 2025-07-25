import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.features': 'Features',
    'header.practice': 'Practice',
    'header.pricing': 'Pricing',
    'header.login': 'Log in',
    'header.english': 'English',
    'header.vietnamese': 'Vietnamese',
    'header.testimonials': 'Testimonials',
    'header.language': 'Language',
    
    // Hero Section
    'hero.badge': 'AI-Powered Speaking Practice',
    'hero.title': 'Struggling with IELTS Speaking?',
    'hero.highlight': 'Native Can Fix That.',
    'hero.description': 'Practice real IELTS questions, get instant AI feedback, and improve your fluency — all in one app.',
    'hero.cta.primary': 'Start Free Practice →',
    'hero.trial': 'Free trial • No credit card required',
    'hero.dashboard.title': 'IELTS Speaking Practice Dashboard',
    'hero.nav.practice': 'Practice',
    'hero.nav.feedback': 'Feedback',
    'hero.nav.progress': 'Progress',
    'hero.nav.tips': 'Tips',
    'hero.nav.part1': 'Part 1',
    'hero.nav.part2': 'Part 2', 
    'hero.nav.part3': 'Part 3',
    'hero.nav.fluency': 'Fluency',
    'hero.board.title': 'Speaking Tasks',
    'hero.board.count': '12',

    // Features
    'features.title': 'Everything You Need to Reach Your Target',
    'features.subtitle': 'Comprehensive IELTS speaking preparation with AI-powered feedback and personalized learning',
    'features.ai.title': 'AI Speech Analysis',
    'features.ai.description': 'Pinpoint pronunciation mistakes instantly with AI.',
    'features.ai.expanded': 'Our cutting-edge AI technology provides instant feedback on your speaking performance. Get detailed analysis of pronunciation accuracy, speaking pace, grammatical structures, and vocabulary usage. Receive personalized recommendations to improve your weak areas.',
    'features.feedback.title': 'Instant Feedback',
    'features.feedback.description': 'Know exactly where you need to improve in seconds.',
    'features.feedback.expanded': 'Receive comprehensive feedback immediately after each practice session. Our system evaluates your responses based on IELTS criteria including fluency, coherence, lexical resource, and grammatical range. Get specific suggestions for improvement with examples.',
    'features.practice.title': 'Part-by-Part Practice',
    'features.practice.description': 'Simulate the real IELTS Speaking test.',
    'features.practice.expanded': 'Practice with authentic IELTS speaking questions for Parts 1, 2, and 3. Each section focuses on different skills - personal questions, long turn speaking, and discussion topics. Track your progress across all parts.',
    'features.progress.title': 'Progress Tracking',
    'features.progress.description': 'See your growth and stay motivated.',
    'features.progress.expanded': 'Track your speaking development with comprehensive analytics. See your improvement over time, identify strengths and weaknesses, and get accurate band score predictions based on your performance.',
    'features.vocabulary.title': 'Vocabulary Builder',
    'features.vocabulary.description': 'Expand IELTS vocabulary with tips and examples.',
    'features.vocabulary.expanded': 'Expand your vocabulary with topic-specific word lists and interactive exercises. Learn high-scoring vocabulary for common IELTS topics with definitions, examples, and pronunciation guides.',
    'features.tips.title': 'Expert Tips',
    'features.tips.description': 'Learn examiner secrets to score higher.',
    'features.tips.expanded': 'Learn from experienced IELTS instructors with proven strategies for each part of the speaking test. Get insider tips on how to structure your answers, manage time effectively, and impress the examiner.',
    
    // Feature Sections
    'features.section1.title': 'Practice smarter, not harder',
    'features.section1.description': 'Speak anytime with an AI tutor that simulates real test conditions, using predicted IELTS questions updated regularly.',
    'features.section1.feature1.title': 'Pronunciation diagnosis',
    'features.section1.feature1.description': 'Instantly spot mispronunciations, intonation mistakes, and weak stress - with suggestions to fix them.',
    'features.section1.feature2.title': 'Real-time fixes',
    'features.section1.feature2.description': 'Don\'t wait for a teacher. Get pinpoint corrections on grammar, fluency, coherence - right after you speak.',
    
    'features.section2.title': 'Get feedback that actually helps',
    'features.section2.description': 'Instant corrections after every sentence with scoring and tips based on real IELTS criteria, so you don\'t just practice, you improve.',
    'features.section2.feature1.title': 'Deep learning insights',
    'features.section2.feature1.description': 'Our AI understands context, emotion, and nuance in your speech to provide meaningful feedback.',
    'features.section2.feature2.title': 'Personalized coaching',
    'features.section2.feature2.description': 'Get customized lesson plans based on your specific strengths and areas for improvement.',
    
    'features.section3.title': 'Stay on track to your goal',
    'features.section3.description': 'See your estimated band score and track progress over time, plus get reminders and insights to keep you motivated.',
    'features.section3.feature1.title': 'Lightning-fast feedback',
    'features.section3.feature1.description': 'Get instant corrections and suggestions without waiting for human review or scheduling sessions.',
    'features.section3.feature2.title': 'Progress tracking',
    'features.section3.feature2.description': 'Monitor your improvement with detailed analytics and performance metrics over time.',
    
    // Testimonials
    'testimonials.title': 'Trusted by 2,000+ IELTS Learners Worldwide.',
    'testimonials.subtitle': 'Join students who boosted their scores by up to 1.5 bands.',
    'testimonials.card1.quote': 'I was literally just memorizing sample answers but would blank in the mock test. Native taught me to expand my own ideas and speak with confidence',
    'testimonials.card1.author': 'Sarah',
    'testimonials.card1.position': 'IELTS Student',
    'testimonials.card2.quote': 'Found Native one month before my test and was lowkey panicking. Got a clear plan, focused practice and real test predictions. Boosted my score by 1.5 bands, hit my aim score of 7.0 speaking!!!',
    'testimonials.card2.author': 'Lam Bui',
    'testimonials.card2.position': 'IELTS Student',
    'testimonials.card3.quote': 'I didn\'t take any class so have this self-practice was really helpful and flexible. The speaking practice tips hit different and it was great to see myself speak better everyday!',
    'testimonials.card3.author': 'Linh Nguyen',
    'testimonials.card3.position': 'Working Professional',
    
    // Problem Section
    'problem.title': 'The Speaking Problem',
    'problem.subtitle': 'Speaking is one of the hardest and most intangible skills to improve',
    'problem.card1.title': 'I practice a lot, but my score won\'t budge.',
    'problem.card1.description': 'The real issue? You\'re not targeting the right skills. Random practice or tutoring alone isn\'t enough.',
    'problem.card2.title': 'I don\'t have anyone to practice with.',
    'problem.card2.description': 'Speaking requires real interaction, not just reading scripts. Without feedback or immersion, your fluency stalls.',
    'problem.card3.title': 'I freeze during the actual test.',
    'problem.card3.description': 'Practicing in the wrong format trains the wrong reflexes. You need simulation, not theory.',
    'problem.tapToReveal': 'Tap to reveal',
    'problem.tapToFlipBack': 'Tap to flip back',
    'problem.problemLabel': 'Problem',
    
    // Institutions
    'institutions.title': 'Backed by Top Institutions',
    
    // Awards
    'awards.title': 'Awards & Recognition',
    'awards.subtitle': 'Trusted by students and recognized by industry leaders',
    'awards.award1.title': 'Techstars Hackathon Winner',
    'awards.award1.description': 'Recognized for innovative AI-powered language learning solution',
    'awards.award2.title': 'Student Empowerment Award',
    'awards.award2.description': 'USC Office of Research and Innovation',
    'awards.award3.title': 'Catalyst Microgrant Winner',
    'awards.award3.description': 'USC Marshall Lloyd Grief Center for Entrepreneurial Studies',
    
    // Call to Action
    'cta.title': 'Ready to Speak Confidently?',
    'cta.button': 'Start Free Practice Now',
    'cta.urgency': 'Limited free spots available this month.',
    'cta.stats.students': 'Active Students',
    'cta.stats.rating': 'Average Rating',
    'cta.stats.improvement': 'Score Improvement',

    // Pricing
    'pricing.title': 'Choose your learning plan',
    'pricing.subtitle': 'Start your IELTS speaking journey with plans designed for every learner',
    'pricing.basic.name': 'Basic',
    'pricing.basic.price': 'Free',
    'pricing.basic.description': 'Perfect for getting started with IELTS speaking practice',
    'pricing.basic.feature1': '5 practice sessions/week',
    'pricing.basic.feature2': 'Basic feedback',
    'pricing.basic.feature3': 'Part 1 questions only',
    'pricing.basic.feature4': 'Community support',
    'pricing.basic.feature5': 'Progress tracking',
    'pricing.basic.button': 'Get Started',
    'pricing.premium.name': 'Premium',
    'pricing.premium.price': '$29',
    'pricing.premium.period': 'per month',
    'pricing.premium.description': 'Comprehensive IELTS speaking preparation for serious learners',
    'pricing.premium.feature1': 'Unlimited practice sessions',
    'pricing.premium.feature2': 'Detailed AI feedback',
    'pricing.premium.feature3': 'All 3 parts practice',
    'pricing.premium.feature4': 'Band score prediction',
    'pricing.premium.feature5': 'Vocabulary builder',
    'pricing.premium.feature6': 'Expert tips library',
    'pricing.premium.feature7': 'Priority support',
    'pricing.premium.button': 'Start 7-day trial',
    'pricing.tutor.name': 'Personal Tutor',
    'pricing.tutor.price': '$99',
    'pricing.tutor.period': 'per month',
    'pricing.tutor.description': 'One-on-one coaching with certified IELTS instructors',
    'pricing.tutor.feature1': 'Everything in Premium',
    'pricing.tutor.feature2': 'Live 1-on-1 sessions',
    'pricing.tutor.feature3': 'Personalized study plan',
    'pricing.tutor.feature4': 'Mock speaking tests',
    'pricing.tutor.feature5': 'Instant messaging support',
    'pricing.tutor.feature6': 'Exam strategies coaching',
    'pricing.tutor.feature7': 'Success guarantee',
    'pricing.tutor.button': 'Book Consultation',
    'pricing.contact': 'Have questions? Contact our team',

    // Footer
    'footer.description': 'AI-powered IELTS speaking tutor helping students achieve their target band scores.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.practice': 'Practice',
    'footer.pricing': 'Pricing',
    'footer.updates': 'Updates',
    'footer.roadmap': 'Roadmap',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.resources': 'Resources',
    'footer.help': 'Help Center',
    'footer.guides': 'Study Guides',
    'footer.community': 'Community',
    'footer.documentation': 'Documentation',
    'footer.copyright': '© 2025 Native Speaking. All rights reserved.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.cookies': 'Cookies'
  },
  vi: {
    // Header
    'header.features': 'Chức năng',
    'header.practice': 'Trang chủ',
    'header.pricing': 'Giá cả',
    'header.login': 'Đăng ký',
    'header.english': 'Tiếng Anh',
    'header.vietnamese': 'Tiếng Việt',
    'header.testimonials': 'Review',
    'header.language': 'Ngôn ngữ',
    
    // Hero Section
    'hero.badge': 'Luyện nói với AI',
    'hero.title': 'Vật vã vì IELTS Speaking mãi không lên band? Native xử được',
    'hero.highlight': 'tự tin',
    'hero.description': 'Luyện đề thật, nhận phản hồi ngay, cải thiện phản xạ với AI',
    'hero.cta.primary': 'Dùng thử miễn phí',
    'hero.trial': 'Dùng thử miễn phí • Không cần thẻ tín dụng',
    'hero.dashboard.title': 'Bảng điều khiển luyện tập IELTS Speaking',
    'hero.nav.practice': 'Luyện tập',
    'hero.nav.feed ': 'Phản hồi',
    'hero.nav.progress': 'Tiến độ',
    'hero.nav.tips': 'Mẹo hay',
    'hero.nav.part1': 'Phần 1',
    'hero.nav.part2': 'Phần 2',
    'hero.nav.part3': 'Phần 3',
    'hero.nav.fluency': 'Độ trôi chảy',
    'hero.board.title': 'Bài tập nói',
    'hero.board.count': '12',

    // Features
    'features.title': 'Cách Native giúp bạn',
    'features.subtitle': 'Chuẩn bị toàn diện cho IELTS Speaking với phản hồi AI và học tập cá nhân hóa',
    'features.ai.title': 'Phân tích giọng nói AI',
    'features.ai.description': 'AI tiên tiến phân tích phát âm, độ trôi chảy và ngữ pháp theo thời gian thực.',
    'features.ai.expanded': 'Công nghệ AI tiên tiến cung cấp phản hồi tức thì về hiệu suất nói của bạn. Nhận phân tích chi tiết về độ chính xác phát âm, tốc độ nói, cấu trúc ngữ pháp và sử dụng từ vựng. Nhận khuyến nghị cá nhân hóa để cải thiện điểm yếu.',
    'features.feedback.title': 'Phản hồi tức thì',
    'features.feedback.description': 'Nhận phản hồi chi tiết ngay lập tức về phát âm, ngữ pháp và từ vựng.',
    'features.feedback.expanded': 'Nhận phản hồi toàn diện ngay sau mỗi buổi luyện tập. Hệ thống đánh giá câu trả lời dựa trên tiêu chí IELTS bao gồm độ trôi chảy, tính mạch lạc, tài nguyên từ vựng và phạm vi ngữ pháp. Nhận gợi ý cụ thể để cải thiện với ví dụ.',
    'features.practice.title': 'Luyện tập từng phần',
    'features.practice.description': 'Luyện tập cả ba phần IELTS Speaking với câu hỏi thi thật.',
    'features.practice.expanded': 'Luyện tập với câu hỏi IELTS Speaking thật cho Phần 1, 2 và 3. Mỗi phần tập trung vào các kỹ năng khác nhau - câu hỏi cá nhân, nói dài và chủ đề thảo luận. Theo dõi tiến độ của bạn qua tất cả các phần.',
    'features.progress.title': 'Theo dõi tiến độ',
    'features.progress.description': 'Theo dõi sự cải thiện với phân tích chi tiết và dự đoán band điểm.',
    'features.progress.expanded': 'Theo dõi sự phát triển kỹ năng nói với phân tích toàn diện. Xem sự cải thiện theo thời gian, xác định điểm mạnh và yếu, và nhận dự đoán band điểm chính xác dựa trên hiệu suất.',
    'features.vocabulary.title': 'Xây dựng từ vựng',
    'features.vocabulary.description': 'Xây dựng từ vựng theo chủ đề với bài tập tương tác và ví dụ.',
    'features.vocabulary.expanded': 'Mở rộng từ vựng với danh sách từ theo chủ đề và bài tập tương tác. Học từ vựng điểm cao cho các chủ đề IELTS phổ biến với định nghĩa, ví dụ và hướng dẫn phát âm.',
    'features.tips.title': 'Mẹo chuyên gia',
    'features.tips.description': 'Tiếp cận các chiến lược và mẹo đã được chứng minh từ chuyên gia IELTS Speaking.',
    'features.tips.expanded': 'Học từ các giảng viên IELTS giàu kinh nghiệm với chiến lược đã được chứng minh cho từng phần của bài thi nói. Nhận mẹo nội bộ về cách cấu trúc câu trả lời, quản lý thời gian hiệu quả và gây ấn tượng với giám khảo.',
    
    // Feature Sections
    'features.section1.title': 'Luyện tập khoa học, không luyện "cày"',
    'features.section1.description': 'Luyện speaking bất cứ lúc nào cùng AI mô phỏng bài thi thật. Bộ câu hỏi được cập nhật theo xu hướng đề IELTS mới nhất.',
    'features.section1.feature1.title': 'Chẩn đoán phát âm',
    'features.section1.feature1.description': 'Phát hiện ngay lập tức lỗi phát âm, ngữ điệu và trọng âm yếu - với gợi ý để sửa chúng.',
    'features.section1.feature2.title': 'Sửa lỗi thời gian thực',
    'features.section1.feature2.description': 'Không cần chờ giáo viên. Nhận sửa lỗi chính xác về ngữ pháp, độ trôi chảy, tính mạch lạc - ngay sau khi bạn nói.',
    
    'features.section2.title': 'Feedback rõ ràng, cải thiện thật',
    'features.section2.description': 'Nhận phản hồi chi tiết, điểm số ước lượng và gợi ý cải thiện dựa trên tiêu chí chấm thi thật. Luyện tập đi kèm với tiến bộ ngay lập tức.',
    'features.section2.feature1.title': 'Thông tin chi tiết học sâu',
    'features.section2.feature1.description': 'AI của chúng tôi hiểu ngữ cảnh, cảm xúc và sắc thái trong lời nói để cung cấp phản hồi có ý nghĩa.',
    'features.section2.feature2.title': 'Huấn luyện cá nhân hóa',
    'features.section2.feature2.description': 'Nhận kế hoạch học tập tùy chỉnh dựa trên điểm mạnh và lĩnh vực cần cải thiện cụ thể của bạn.',
    
    'features.section3.title': 'Mục tiêu tập trung, rõ ràng',
    'features.section3.description': 'Theo dõi điểm thi phỏng đoán và tiến trình học mỗi ngày. Hệ thống nhắc nhở lịch và đưa ra lời khuyên để bạn giữ vững động lực.',
    'features.section3.feature1.title': 'Phản hồi nhanh như chớp',
    'features.section3.feature1.description': 'Nhận sửa lỗi và gợi ý tức thì mà không cần chờ đánh giá của con người hoặc lên lịch buổi học.',
    'features.section3.feature2.title': 'Theo dõi tiến độ',
    'features.section3.feature2.description': 'Theo dõi sự cải thiện với phân tích chi tiết và số liệu hiệu suất theo thời gian.',

    // Testimonials
    'testimonials.title': 'Hàng nghìn học viên IELTS trên toàn thế giới tin dùng',
    'testimonials.subtitle': 'Rất nhiều bạn đã nâng band điểm chỉ sau hai tháng dùng Native.',
    'testimonials.card1.quote': 'Trước giờ mình toàn học thuộc mẫu câu, nhưng cứ vào tình huống thật là bí luôn. Native giúp mình biết cách tự xây câu trả lời từ ý tưởng của chính mình.',
    'testimonials.card1.author': 'Sarah',
    'testimonials.card1.position': 'Học sinh IELTS',
    'testimonials.card2.quote': 'Mình biết đến Native chỉ 1 tháng trước ngày thi nên khá hoang mang. Nhưng app cho lộ trình rõ ràng, đề dự đoán sát, luyện tập đúng trọng tâm. Kết quả mình đạt aim 7.0, huhu cảm ơn Native.',
    'testimonials.card2.author': 'Lâm Bùi',
    'testimonials.card2.position': 'Chuẩn bị thi gấp',
    'testimonials.card3.quote': 'Vừa làm vừa học nên mình không có đi học theo lớp được, dùng Native rất tiện vì có thể luyện tập linh hoạt. Giao diện dễ dùng và feedback của Native rất trúng, kiểu thấy mình tiến bộ mỗi ngày luôn ý.',
    'testimonials.card3.author': 'Linh Nguyễn',
    'testimonials.card3.position': 'Nhân viên văn phòng',
    
    // Problem Section
    'problem.title': 'Vì sao học Speaking mãi không khá?',
    'problem.subtitle': 'Speaking là kỹ năng khó cải thiện nhất. Không chỉ cần chăm, mà còn phải luyện tập đúng cách.',
    'problem.card1.title': 'Luyện hoài mà điểm vẫn không lên',
    'problem.card1.description': 'Rất có thể bạn đang luyện sai trọng tâm. Chỉ học mẫu câu hay nói theo template chưa đủ để lên band.',
    'problem.card2.title': 'Không có ai luyện tập cùng nên phản xạ kém',
    'problem.card2.description': 'Muốn nói trôi chảy, bạn cần môi trường có phản hồi thật, chứ không chỉ luyện một chiều.',
    'problem.card3.title': 'Vào thi là cứng họng, đầu trống rỗng',
    'problem.card3.description': 'Vì bạn chưa luyện trong bối cảnh mô phỏng thật. Chưa làm quen với áp lực nên vào thi dễ bị “đơ”',
    'problem.tapToReveal': 'Xem thêm',
    'problem.tapToFlipBack': 'Nhấn để lật lại',
    'problem.problemLabel': 'Vấn đề',
    
    // Institutions
    'institutions.title': 'Hợp tác cùng nhiều đối tác uy tín',
    
        // Awards
    'awards.title': 'Giải thưởng & Công nhận',
    'awards.subtitle': 'Được tin tưởng bởi học viên và công nhận bởi các nhà lãnh đạo ngành',
    'awards.award1.title': 'Giải Nhất Techstars Hackathon',
    'awards.award1.description': 'Được công nhận cho giải pháp học ngôn ngữ với AI sáng tạo',
    'awards.award2.title': 'Giải thưởng Trao quyền cho Sinh viên',
    'awards.award2.description': 'Văn phòng Nghiên cứu và Đổi mới USC',
    'awards.award3.title': 'Người thắng Catalyst Microgrant',
    'awards.award3.description': 'Trung tâm Nghiên cứu Doanh nhân Lloyd Grief USC Marshall',
    
    // Call to Action
    'cta.title': 'Sẵn sàng để bứt phá Speaking?',
    'cta.button': 'Bắt đầu luyện miễn phí',
    'cta.urgency': 'Số lượng miễn phí có hạn trong tháng này.',
    'cta.stats.students': 'Học viên đang học',
    'cta.stats.rating': 'Đánh giá trung bình',
    'cta.stats.improvement': 'Cải thiện điểm số',
    
    // Pricing
    'pricing.title': 'Chọn gói học của bạn',
    'pricing.subtitle': 'Bắt đầu hành trình IELTS Speaking với các gói được thiết kế cho mọi học viên',
    'pricing.basic.name': 'Cơ bản',
    'pricing.basic.price': 'Miễn phí',
    'pricing.basic.description': 'Hoàn hảo để bắt đầu luyện tập IELTS Speaking',
    'pricing.basic.feature1': '5 buổi luyện/tuần',
    'pricing.basic.feature2': 'Phản hồi cơ bản',
    'pricing.basic.feature3': 'Chỉ câu hỏi Phần 1',
    'pricing.basic.feature4': 'Hỗ trợ cộng đồng',
    'pricing.basic.feature5': 'Theo dõi tiến độ',
    'pricing.basic.button': 'Bắt đầu',
    'pricing.premium.name': 'Premium',
    'pricing.premium.price': '$29',
    'pricing.premium.period': 'mỗi tháng',
    'pricing.premium.description': 'Chuẩn bị IELTS Speaking toàn diện cho học viên nghiêm túc',
    'pricing.premium.feature1': 'Luyện tập không giới hạn',
    'pricing.premium.feature2': 'Phản hồi AI chi tiết',
    'pricing.premium.feature3': 'Luyện tập cả 3 phần',
    'pricing.premium.feature4': 'Dự đoán band điểm',
    'pricing.premium.feature5': 'Xây dựng từ vựng',
    'pricing.premium.feature6': 'Thư viện mẹo chuyên gia',
    'pricing.premium.feature7': 'Hỗ trợ ưu tiên',
    'pricing.premium.button': 'Dùng thử 7 ngày',
    'pricing.tutor.name': 'Gia sư cá nhân',
    'pricing.tutor.price': '$99',
    'pricing.tutor.period': 'mỗi tháng',
    'pricing.tutor.description': 'Hướng dẫn 1-1 với giảng viên IELTS được chứng nhận',
    'pricing.tutor.feature1': 'Mọi thứ trong Premium',
    'pricing.tutor.feature2': 'Buổi học trực tiếp 1-1',
    'pricing.tutor.feature3': 'Kế hoạch học cá nhân',
    'pricing.tutor.feature4': 'Bài thi nói thử',
    'pricing.tutor.feature5': 'Hỗ trợ tin nhắn tức thì',
    'pricing.tutor.feature6': 'Huấn luyện chiến lược thi',
    'pricing.tutor.feature7': 'Bảo đảm thành công',
    'pricing.tutor.button': 'Đặt tư vấn',
    'pricing.contact': 'Có câu hỏi? Liên hệ đội ngũ của chúng tôi',

    // Footer
    'footer.description': 'Trợ lý Speaking IELTS dùng AI - giúp bạn chạm đến band điểm mục tiêu.',
    'footer.product': 'Sản phẩm',
    'footer.features': 'Tính năng',
    'footer.practice': 'Luyện tập',
    'footer.pricing': 'Giá cả',
    'footer.updates': 'Cập nhật',
    'footer.roadmap': 'Lộ trình',
    'footer.company': 'Công ty',
    'footer.about': 'Về chúng tôi',
    'footer.blog': 'Blog',
    'footer.careers': 'Tuyển dụng',
    'footer.resources': 'Tài nguyên',
    'footer.help': 'Trung tâm trợ giúp',
    'footer.guides': 'Hướng dẫn học',
    'footer.community': 'Cộng đồng',
    'footer.documentation': 'Tài liệu',
    'footer.copyright': '© 2025 Native Speaking. Bảo lưu mọi quyền.',
    'footer.privacy': 'Riêng tư',
    'footer.terms': 'Điều khoản',
    'footer.cookies': 'Cookies'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};