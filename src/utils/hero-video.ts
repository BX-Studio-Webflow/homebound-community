export interface HeroVideoConfig {
    enabled: boolean;
    pathname: string;
    videoUrl: string;
    title: string;
    index: number;
}

interface HeroSwiper {
    addSlide(index: number, slide: HTMLElement): void;
    on(event: 'slideChangeTransitionStart' | 'slideChangeTransitionEnd', handler: () => void): void;
}

type HeroSwiperElement = HTMLElement & { swiper?: HeroSwiper };

export class HeroVideoController {
    private static readonly HERO_SWIPER_SELECTOR = '[hero-swiper]';
    private static readonly VIDEO_SLIDE_SELECTOR = '[data-hb-hero-video]';
    private resizeObserver: ResizeObserver | null = null;

    constructor(private readonly configs: HeroVideoConfig[]) { }

    init(): void {
        const config = this.configs.find(
            ({ enabled, pathname }) => enabled && pathname === window.location.pathname
        );
        if (!config) return;

        const heroSwiper = document.querySelector<HeroSwiperElement>(
            HeroVideoController.HERO_SWIPER_SELECTOR
        );
        const swiper = heroSwiper?.swiper;

        if (!swiper || heroSwiper.querySelector(HeroVideoController.VIDEO_SLIDE_SELECTOR)) return;

        swiper.addSlide(config.index, this.createSlide(config));
        this.matchVideoHeight(heroSwiper);
        swiper.on('slideChangeTransitionStart', () => this.pauseVideos(heroSwiper));
        swiper.on('slideChangeTransitionEnd', () => this.playActiveVideo(heroSwiper));
        requestAnimationFrame(() => this.playActiveVideo(heroSwiper));
    }

    private matchVideoHeight(heroSwiper: HTMLElement): void {
        const videoFrame = heroSwiper.querySelector<HTMLElement>(
            '[data-hb-hero-video] .one-slide'
        );
        const referenceFrame = heroSwiper.querySelector<HTMLElement>(
            '.swiper-slide:not([data-hb-hero-video]) .one-slide'
        );
        if (!videoFrame || !referenceFrame) return;

        const syncHeight = () => {
            const { height } = referenceFrame.getBoundingClientRect();
            if (height > 0) videoFrame.style.height = `${height}px`;
        };

        syncHeight();
        this.resizeObserver?.disconnect();
        this.resizeObserver = new ResizeObserver(syncHeight);
        this.resizeObserver.observe(referenceFrame);
    }

    private pauseVideos(heroSwiper: HTMLElement): void {
        heroSwiper
            .querySelectorAll<HTMLVideoElement>('[data-hb-hero-video] video')
            .forEach((video) => video.pause());
    }

    private playActiveVideo(heroSwiper: HTMLElement): void {
        const video = heroSwiper.querySelector<HTMLVideoElement>(
            '[data-hb-hero-video].swiper-slide-active video'
        );
        if (video) void video.play().catch(() => undefined);
    }

        private createSlide({ videoUrl, title }: HeroVideoConfig): HTMLElement {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide is-hero-video';
                slide.dataset.hbHeroVideo = '';

                const frame = document.createElement('div');
                frame.className = 'one-slide';
                frame.style.cssText = 'position:relative;width:100%;overflow:hidden';

                const video = document.createElement('video');
                video.className = 'Verbal-visual';
                video.muted = true;
                video.playsInline = true;
                video.loop = true;
                video.setAttribute('aria-label', title);
                video.style.cssText =
                        'position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover';

                const source = document.createElement('source');
                source.src = videoUrl;
                source.type = 'video/mp4';

                video.append(source);
                frame.append(video);
                slide.append(frame);
                return slide;
    }
}
