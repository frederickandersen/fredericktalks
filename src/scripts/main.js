import Alpine from 'alpinejs'
import { inject } from '@vercel/analytics'

inject()

// Load content from JSON
let siteContent = {}

async function loadContent() {
  try {
    const response = await fetch('/data/content.json')
    siteContent = await response.json()

    // Update page title from content (only for home page, others have their own)
    if (isPage('/')) {
      document.title = siteContent.site.title
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && siteContent.site.description && isPage('/')) {
      metaDesc.setAttribute('content', siteContent.site.description)
    }

    // Inject shared components
    injectNavigation()
    injectFooter()
    injectModal()
    injectStickyCta()

    // Initialize Alpine on injected elements
    document.querySelectorAll('[data-alpine-inject]').forEach(el => {
      Alpine.initTree(el)
    })

    // Populate page-specific content
    populateContent()

    // If we arrived with a hash (e.g. /#talks-section from another page),
    // scroll to it after content is injected and fonts have loaded so the
    // position is accurate (avoids landing short due to late layout shifts).
    if (window.location.hash) {
      const scrollToHash = () => {
        const target = document.querySelector(window.location.hash)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()
      fontsReady.then(() => requestAnimationFrame(scrollToHash))
    }
  } catch (error) {
    console.error('Error loading content:', error)
  }
}

// ── Page Detection ──────────────────────────────────────────────────

function isPage(path) {
  const p = window.location.pathname
  if (path === '/') return p === '/' || p === '/index.html'
  return p.startsWith(path)
}

// ── Shared Component Injectors ──────────────────────────────────────

function injectNavigation() {
  const placeholder = document.getElementById('nav-placeholder')
  if (!placeholder) return

  const nav = siteContent.navigation
  const currentPath = window.location.pathname

  const logoSvg = `<svg width="112" height="37" viewBox="0 0 112 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.09832 3.04231C7.03414 3.2646 7.12444 3.48036 7.17013 4.12218C7.21582 4.76292 7.27566 5.18027 7.3257 6.24707C7.37466 7.31387 7.39424 8.00146 7.416 9.45619C7.43776 10.9109 7.4617 11.775 7.43559 13.5218C7.40948 15.2686 7.36596 16.2624 7.28654 18.1911C7.20821 20.1209 7.15707 21.2084 7.04066 23.1677C6.92534 25.1269 6.84919 26.2406 6.70775 27.9895C6.56632 29.7374 6.47058 30.6168 6.33241 31.908C6.19315 33.2004 6.11265 33.6984 6.01364 34.4459C5.91464 35.1934 5.82216 35.3983 5.83522 35.6457C5.84828 35.8941 5.99406 35.917 6.08001 35.6838C6.16596 35.4495 6.17031 35.2294 6.26605 34.4786C6.3607 33.7289 6.43142 33.2266 6.55762 31.932C6.68382 30.6364 6.76541 29.7548 6.89705 28.0037C7.0287 26.2537 7.10377 25.1389 7.218 23.1786C7.33223 21.2172 7.38445 20.1296 7.4704 18.1998C7.55526 16.2689 7.60313 15.2751 7.64447 13.5262C7.68581 11.7772 7.67385 10.912 7.67929 9.4551C7.68364 7.9971 7.68581 7.30842 7.6695 6.23726C7.65209 5.16501 7.62924 4.74112 7.59334 4.09494C7.55852 3.44985 7.59116 3.22102 7.49216 3.01071C7.39316 2.79931 7.16251 2.82001 7.09832 3.04231Z" fill="black" stroke="black"/><path d="M0.708904 5.76005C0.862304 5.78294 0.933021 5.7448 1.28007 5.56391C1.62822 5.38193 1.77835 5.16836 2.44635 4.85235C3.11435 4.53525 3.5517 4.33911 4.61898 3.9806C5.68625 3.6221 6.40211 3.43031 7.78272 3.05764C9.16332 2.68606 9.99233 2.46594 11.522 2.12051C13.0516 1.77508 13.8915 1.58112 15.431 1.33049C16.9704 1.08095 17.7896 0.985058 19.2181 0.869552C20.6477 0.755135 21.3701 0.750778 22.5744 0.756227C23.7788 0.762765 24.3521 0.797636 25.2399 0.900066C26.1265 1.00359 26.4856 1.14306 27.011 1.26947C27.5365 1.39587 27.6486 1.4667 27.8672 1.53208C28.0848 1.59855 28.0337 1.60618 28.1022 1.59964C28.1719 1.59201 28.2241 1.58983 28.2121 1.49612C28.2013 1.40241 28.2676 1.26293 28.0457 1.13217C27.8237 1.0014 27.6595 0.951278 27.1046 0.842309C26.5487 0.733341 26.1755 0.654886 25.2692 0.586236C24.363 0.518676 23.7875 0.491432 22.5733 0.502329C21.3592 0.514315 20.6357 0.523033 19.1996 0.646168C17.7646 0.768212 16.9421 0.866285 15.3961 1.11691C13.8502 1.36645 13.0081 1.55932 11.4719 1.89604C9.93576 2.23275 9.10674 2.44851 7.71526 2.79938C6.32378 3.15026 5.60683 3.32897 4.51562 3.65043C3.42332 3.97188 2.96748 4.13752 2.25814 4.40885C1.5488 4.67909 1.31598 4.79351 0.966747 5.00273C0.618604 5.21086 0.566383 5.29912 0.514161 5.45167C0.463028 5.60314 0.555504 5.73826 0.708904 5.76005Z" fill="black" stroke="black"/><path d="M8.04102 17.1864C8.0421 17.3749 8.10412 17.6844 8.38807 17.8467C8.67202 18.0102 8.93096 18.0734 9.46078 18.0025C9.9917 17.9328 10.2909 17.8413 11.0383 17.4947C11.7846 17.1482 12.2916 16.8355 13.1946 16.2721C14.0965 15.7098 14.6459 15.2533 15.55 14.6812C16.4541 14.1091 16.9676 13.7637 17.7128 13.4117C18.4581 13.0597 18.8062 12.9301 19.2762 12.9192C19.7473 12.9083 19.8441 12.9508 20.0639 13.3572C20.2847 13.7626 20.3337 14.1102 20.3772 14.9471C20.4196 15.7839 20.3587 16.368 20.2804 17.5416C20.2021 18.7163 20.1128 19.454 19.9866 20.8183C19.8594 22.1826 19.7723 22.9987 19.6472 24.3652C19.5221 25.7306 19.4459 26.5271 19.36 27.6484C19.274 28.7686 19.2022 29.3135 19.2186 29.9673C19.2338 30.6211 19.2914 30.8314 19.4394 30.9164C19.5874 31.0014 19.7799 30.8641 19.9562 30.3922C20.1324 29.9204 20.1825 29.454 20.3206 28.5583C20.4588 27.6626 20.5339 27.0306 20.647 25.9115C20.7602 24.7934 20.7928 24.0873 20.8864 22.9661C20.9799 21.8448 21.03 21.204 21.1148 20.3061C21.1997 19.4082 21.2835 18.9942 21.3107 18.4766C21.3379 17.96 21.3248 17.8042 21.253 17.7225C21.1812 17.6397 20.9429 17.7868 20.9506 18.0646C20.9582 18.3425 21.0528 18.6248 21.29 19.1107C21.5283 19.5957 21.7045 19.9444 22.1375 20.4914C22.5716 21.0384 22.8599 21.4024 23.4572 21.8448C24.0545 22.2872 24.4059 22.5291 25.1228 22.7045C25.8398 22.88 26.2532 22.8952 27.0431 22.7209C27.834 22.5465 28.2757 22.3438 29.0732 21.8328C29.8706 21.3228 30.3091 20.9065 31.0304 20.1699C31.7528 19.4322 32.1314 18.9571 32.6819 18.1486C33.2324 17.3411 33.4837 16.8638 33.7829 16.1283C34.081 15.3917 34.1821 15.0233 34.1767 14.4687C34.1723 13.913 34.0777 13.5839 33.7589 13.3518C33.4402 13.1197 33.0735 13.099 32.5818 13.3082C32.0889 13.5174 31.7952 13.7669 31.2991 14.3968C30.803 15.0266 30.5136 15.4919 30.1013 16.4563C29.69 17.4206 29.4572 18.0745 29.2385 19.2186C29.0198 20.3639 28.96 21.0558 29.0068 22.1793C29.0547 23.3039 29.1308 23.9381 29.4757 24.8392C29.8195 25.7404 30.1013 26.1566 30.7279 26.6873C31.3535 27.218 31.7843 27.3858 32.6057 27.4937C33.4271 27.6016 33.9199 27.5068 34.8349 27.2245C35.7488 26.9423 36.259 26.6448 37.1794 26.0847C38.0998 25.5246 38.5938 25.1258 39.4347 24.4241C40.2746 23.7234 40.7098 23.2886 41.38 22.5781C42.0501 21.8677 42.3428 21.4786 42.7845 20.8728C43.2273 20.268 43.3981 20.0119 43.5896 19.5499C43.7822 19.089 43.8224 18.8841 43.7452 18.5637C43.669 18.2434 43.4971 18.0821 43.2077 17.9502C42.9172 17.8173 42.6659 17.7672 42.2971 17.9034C41.9283 18.0396 41.7096 18.227 41.3615 18.6313C41.0133 19.0345 40.8578 19.3134 40.5564 19.9215C40.254 20.5306 40.1027 20.9066 39.8525 21.6737C39.6012 22.4419 39.4413 22.917 39.302 23.7604C39.1638 24.6049 39.1312 25.1225 39.1606 25.8929C39.1899 26.6644 39.2291 27.0578 39.4489 27.6157C39.6686 28.1737 39.8384 28.4657 40.2583 28.6814C40.6783 28.8972 41.0351 28.8994 41.5497 28.6945C42.0643 28.4897 42.3461 28.263 42.8324 27.6571C43.3187 27.0513 43.5526 26.6361 43.9813 25.6652C44.4099 24.6932 44.6308 24.0873 44.9756 22.8015C45.3216 21.5146 45.4859 20.7387 45.7078 19.2328C45.9308 17.7269 45.9994 16.8289 46.0897 15.2707C46.1789 13.7125 46.1822 12.8614 46.1582 11.4416C46.1343 10.0206 46.0777 9.27526 45.9711 8.16923C45.8634 7.06211 45.8036 6.52817 45.623 5.90705C45.4413 5.28702 45.2813 5.05927 45.0627 5.06581C44.844 5.07235 44.6688 5.3208 44.5285 5.93865C44.3881 6.55759 44.3751 7.05448 44.3599 8.15724C44.3446 9.26 44.3577 9.99772 44.4534 11.4535C44.5481 12.9083 44.6329 13.8323 44.8364 15.4342C45.0387 17.0349 45.1508 17.9372 45.4696 19.4594C45.7872 20.9828 45.9798 21.7783 46.428 23.0478C46.8763 24.3173 47.1396 24.9297 47.7107 25.8079C48.2819 26.6862 48.5876 27.0415 49.2817 27.4403C49.9769 27.8391 50.4251 27.9187 51.1824 27.8021C51.9396 27.6855 52.3497 27.4534 53.0688 26.8573C53.7891 26.2613 54.1459 25.7687 54.7791 24.8207C55.4123 23.8738 55.7582 23.2407 56.2337 22.1205C56.7102 21.0003 56.9028 20.3083 57.1584 19.2197C57.4152 18.1322 57.4892 17.5362 57.5153 16.6808C57.5414 15.8254 57.5305 15.4287 57.2879 14.9449C57.0453 14.46 56.7374 14.2551 56.3011 14.2606C55.8649 14.2649 55.5592 14.4676 55.1087 14.97C54.6583 15.4723 54.4136 15.9082 54.0513 16.7723C53.6879 17.6375 53.4964 18.2477 53.2951 19.2916C53.095 20.3366 53.0221 20.9785 53.0449 21.9951C53.0678 23.0118 53.1483 23.5567 53.4116 24.375C53.6737 25.1945 53.8598 25.6151 54.357 26.0902C54.8542 26.5664 55.2154 26.7244 55.8953 26.7538C56.5753 26.7821 56.9996 26.6405 57.7568 26.234C58.5129 25.8276 58.9274 25.4571 59.6781 24.7215C60.4299 23.986 60.8346 23.4542 61.5135 22.5552C62.1934 21.6563 62.5416 21.0526 63.0768 20.2255C63.6121 19.3973 63.8721 18.9015 64.1909 18.4166C64.5097 17.9306 64.563 17.7933 64.6707 17.7966C64.7773 17.7988 64.712 17.9328 64.7262 18.4308C64.7392 18.9299 64.7414 19.4278 64.736 20.2898C64.7305 21.1517 64.6816 21.8143 64.6979 22.7394C64.7131 23.6634 64.7109 24.2148 64.8132 24.9133C64.9155 25.6118 64.9514 25.991 65.2092 26.2329C65.466 26.4748 65.7837 26.4367 66.1002 26.1229C66.4179 25.809 66.506 25.4059 66.7944 24.6627C67.0837 23.9195 67.2556 23.3376 67.545 22.406C67.8344 21.4754 67.9813 20.8684 68.2435 20.0076C68.5046 19.1467 68.6384 18.6847 68.8527 18.1017C69.0682 17.5176 69.2172 17.3357 69.3162 17.0894C69.4141 16.8431 69.3227 16.8082 69.3445 16.8693C69.3652 16.9314 69.2955 17.1177 69.4217 17.3956C69.5468 17.6745 69.7035 17.8968 69.9711 18.263C70.2388 18.6302 70.3998 18.8874 70.7599 19.2306C71.12 19.575 71.3398 19.7733 71.7717 19.9814C72.2036 20.1906 72.4484 20.2713 72.9184 20.2756C73.3873 20.2811 73.6647 20.2048 74.1217 20.0065C74.5786 19.8092 74.8005 19.6436 75.2031 19.2862C75.6056 18.9299 75.8243 18.64 76.1354 18.2216C76.4466 17.8031 76.6827 17.5242 76.7577 17.194C76.8339 16.8649 76.6631 16.6012 76.513 16.5729C76.3628 16.5435 76.1953 16.6208 76.006 17.0491C75.8156 17.4784 75.7209 17.9034 75.5654 18.7163C75.4098 19.5303 75.301 20.1372 75.2292 21.1179C75.1563 22.0976 75.1117 22.6991 75.2031 23.6188C75.2934 24.5385 75.3771 25.0288 75.6839 25.7175C75.9907 26.4062 76.2203 26.7309 76.7371 27.0611C77.2528 27.3913 77.6042 27.4577 78.2667 27.3684C78.9293 27.279 79.3199 27.109 80.0499 26.6154C80.7788 26.1229 81.2422 25.6314 81.9124 24.9013C82.5837 24.1723 82.9166 23.6482 83.4029 22.9682C83.8892 22.2883 84.2167 21.835 84.344 21.5026C84.4724 21.1703 84.2918 21.0569 84.0426 21.3065C83.7935 21.5549 83.5835 22.0834 83.0983 22.747C82.6131 23.4117 82.2725 23.9217 81.6176 24.6278C80.9616 25.3339 80.5024 25.8123 79.8203 26.2765C79.1382 26.7407 78.7791 26.8639 78.208 26.9488C77.6368 27.0338 77.3975 26.9826 76.9655 26.7037C76.5336 26.4258 76.3247 26.1795 76.0495 25.5551C75.7753 24.9308 75.6687 24.4622 75.5904 23.5817C75.512 22.7023 75.561 22.1063 75.6578 21.155C75.7557 20.2048 75.8885 19.6087 76.0778 18.8274C76.2671 18.0472 76.5042 17.6942 76.6065 17.2507C76.7088 16.8072 76.7077 16.7004 76.588 16.611C76.4683 16.5227 76.2257 16.5707 76.0092 16.805C75.7927 17.0393 75.7601 17.388 75.5066 17.7824C75.252 18.1769 75.0693 18.4602 74.7374 18.7773C74.4056 19.0955 74.2087 19.2143 73.8464 19.3712C73.4852 19.5292 73.2774 19.5728 72.9293 19.5641C72.5811 19.5564 72.4245 19.5107 72.1057 19.332C71.788 19.1543 71.6139 18.9909 71.3376 18.6738C71.0602 18.3556 70.9579 18.105 70.7207 17.7432C70.4847 17.3814 70.4107 17.1101 70.1539 16.8627C69.8972 16.6143 69.709 16.5173 69.4381 16.5031C69.1672 16.489 69.004 16.5042 68.7973 16.793C68.5916 17.0828 68.5971 17.3313 68.4067 17.9502C68.2152 18.5692 68.1021 19.0236 67.8442 19.8877C67.5875 20.7518 67.421 21.3511 67.1196 22.2708C66.8194 23.1894 66.6257 23.7746 66.3418 24.4829C66.0578 25.1912 65.8544 25.5159 65.6988 25.8101C65.5443 26.1043 65.6487 26.1447 65.5672 25.9529C65.4856 25.76 65.3724 25.4919 65.2919 24.8479C65.2103 24.2039 65.1777 23.6427 65.1635 22.7318C65.1505 21.8208 65.2125 21.1648 65.2212 20.2941C65.231 19.4235 65.3126 18.9353 65.2092 18.3774C65.1059 17.8195 64.9764 17.5471 64.7044 17.5056C64.4324 17.4642 64.2344 17.6669 63.8482 18.1714C63.462 18.6771 63.2923 19.1957 62.7722 20.0315C62.2522 20.8684 61.916 21.4666 61.248 22.3547C60.58 23.2417 60.1688 23.7615 59.4344 24.4698C58.7 25.1781 58.2812 25.5203 57.5762 25.8973C56.8712 26.2743 56.5002 26.3713 55.9095 26.3539C55.3198 26.3364 55.0565 26.2275 54.6257 25.8101C54.1949 25.3917 54.0023 25.0288 53.7553 24.265C53.5084 23.5 53.4116 22.9671 53.392 21.9875C53.3713 21.0068 53.4464 20.3737 53.6563 19.3636C53.8652 18.3545 54.0774 17.7563 54.4386 16.9401C54.8009 16.1239 55.087 15.7229 55.4645 15.2827C55.842 14.8425 56.0368 14.7684 56.3251 14.7368C56.6123 14.7062 56.7352 14.7389 56.9028 15.1258C57.0692 15.5137 57.1682 15.8689 57.1595 16.6731C57.1497 17.4784 57.0975 18.0843 56.8571 19.15C56.6155 20.2157 56.4252 20.9033 55.9562 22.0017C55.4884 23.1001 55.1359 23.7245 54.5147 24.6431C53.8935 25.5617 53.529 26.0302 52.8523 26.5947C52.1746 27.1592 51.8112 27.3498 51.129 27.4643C50.4458 27.5787 50.0748 27.5296 49.4362 27.1679C48.7976 26.8072 48.493 26.4999 47.9359 25.6597C47.3778 24.8196 47.0993 24.217 46.6489 22.9682C46.1985 21.7194 46.0016 20.9273 45.685 19.4148C45.3684 17.9012 45.2563 17.0011 45.0659 15.4047C44.8745 13.8094 44.7994 12.8854 44.7298 11.4372C44.659 9.99009 44.6721 9.25129 44.7145 8.16596C44.757 7.08064 44.8712 6.59246 44.9419 6.01275C45.0126 5.43194 45.0028 5.26631 45.0692 5.26304C45.1356 5.25977 45.1497 5.40906 45.2748 5.9964C45.3988 6.58374 45.562 7.10897 45.6915 8.19974C45.821 9.28943 45.8884 10.0348 45.9232 11.4459C45.958 12.8581 45.9548 13.7081 45.8645 15.2576C45.7742 16.8082 45.7035 17.7029 45.4717 19.1968C45.2411 20.6908 45.0703 21.4623 44.7091 22.7274C44.3479 23.9914 44.1096 24.5897 43.6657 25.5192C43.223 26.4487 42.9542 26.8355 42.4919 27.3749C42.0295 27.9132 41.7521 28.0451 41.3539 28.2129C40.9568 28.3807 40.7925 28.3665 40.5031 28.2107C40.2137 28.056 40.0853 27.9045 39.9069 27.437C39.7274 26.9695 39.6436 26.5947 39.6088 25.8744C39.574 25.153 39.5947 24.642 39.7317 23.8324C39.8688 23.0227 40.0309 22.5552 40.2953 21.8262C40.5586 21.0983 40.7326 20.7289 41.0514 20.1906C41.3702 19.6523 41.5682 19.43 41.888 19.1369C42.2079 18.8427 42.4222 18.846 42.6507 18.7239C42.8792 18.6008 42.9249 18.5354 43.0326 18.5245C43.1392 18.5136 43.1707 18.5027 43.186 18.6694C43.2012 18.8372 43.2545 18.9647 43.1087 19.3603C42.9629 19.7548 42.852 20.0468 42.457 20.6439C42.061 21.2411 41.776 21.6388 41.1308 22.3449C40.4846 23.0521 40.0516 23.4847 39.228 24.1767C38.4034 24.8686 37.9083 25.2598 37.0086 25.8036C36.11 26.3473 35.6052 26.6274 34.7337 26.8965C33.8612 27.1657 33.4075 27.242 32.6492 27.1494C31.892 27.0556 31.5199 26.9151 30.9444 26.4302C30.3689 25.9452 30.098 25.578 29.7727 24.7259C29.4463 23.8727 29.3582 23.2559 29.3158 22.1662C29.2722 21.0776 29.3299 20.3933 29.5562 19.2818C29.7814 18.1704 30.0251 17.5274 30.4461 16.6088C30.8661 15.6902 31.1859 15.2511 31.6581 14.6888C32.1292 14.1276 32.4501 13.9794 32.8059 13.7996C33.1616 13.6198 33.2585 13.658 33.4369 13.7909C33.6153 13.9249 33.7034 14.0296 33.698 14.4676C33.6926 14.9057 33.6719 15.2849 33.4097 15.9812C33.1464 16.6775 32.9114 17.1602 32.3849 17.9481C31.8594 18.737 31.4819 19.2077 30.7801 19.9226C30.0784 20.6374 29.6411 21.0406 28.8773 21.5233C28.1136 22.006 27.6904 22.1837 26.9615 22.3351C26.2314 22.4866 25.8713 22.4583 25.2316 22.2817C24.5919 22.1052 24.2829 21.8851 23.7618 21.4536C23.2418 21.0231 22.9937 20.6581 22.6304 20.1263C22.267 19.5946 22.1604 19.2513 21.9439 18.7947C21.7274 18.3382 21.7274 18.0723 21.55 17.8445C21.3716 17.6157 21.1953 17.5351 21.055 17.6538C20.9136 17.7726 20.9049 17.9132 20.8439 18.4373C20.783 18.9615 20.808 19.3766 20.7493 20.2767C20.6916 21.1768 20.6492 21.8186 20.5546 22.9377C20.4599 24.0568 20.4109 24.7618 20.2771 25.8711C20.1422 26.9804 20.0389 27.6048 19.8811 28.4853C19.7244 29.3647 19.5591 29.8038 19.4916 30.2713C19.4242 30.7388 19.5254 30.8826 19.546 30.8227C19.5656 30.7616 19.57 30.6004 19.5917 29.9694C19.6146 29.3385 19.5939 28.7839 19.6581 27.668C19.7212 26.5522 19.7908 25.7535 19.9105 24.3881C20.0312 23.0238 20.1215 22.2098 20.2597 20.8455C20.399 19.4812 20.5045 18.7501 20.6035 17.5667C20.7025 16.3833 20.7939 15.8134 20.7569 14.9296C20.721 14.0459 20.7156 13.6329 20.4196 13.1502C20.1237 12.6674 19.8517 12.5323 19.2784 12.5171C18.705 12.5018 18.3373 12.7012 17.5529 13.0728C16.7696 13.4455 16.2713 13.804 15.3596 14.3772C14.4468 14.9503 13.8952 15.4047 12.9933 15.9398C12.0914 16.4748 11.5681 16.7723 10.849 17.0534C10.131 17.3335 9.82089 17.328 9.40095 17.3444C8.98209 17.3607 8.95598 17.2223 8.75253 17.1352C8.54909 17.048 8.52733 16.8987 8.38481 16.9085C8.24337 16.9194 8.04102 16.9989 8.04102 17.1864Z" fill="black" stroke="black"/><path d="M80.7014 10.1961C80.548 10.2179 80.4533 10.2309 80.4457 10.2723C80.4392 10.3137 80.5153 10.3519 80.6644 10.4042C80.8134 10.4576 81.0277 10.5437 81.192 10.5371C81.3563 10.5306 81.4803 10.4478 81.4847 10.3737C81.489 10.2985 81.3683 10.1993 81.2116 10.1645C81.055 10.1285 80.8537 10.1743 80.7014 10.1961Z" fill="black" stroke="black"/><path d="M90.37 16.7343C90.3483 16.6068 90.3352 16.561 90.2003 16.4662C90.0654 16.3704 89.9751 16.2636 89.6966 16.257C89.4192 16.2516 89.1874 16.257 88.811 16.4379C88.4346 16.6177 88.242 16.7681 87.8123 17.1593C87.3825 17.5505 87.1062 17.7706 86.6612 18.3939C86.2163 19.0172 85.9421 19.4062 85.5874 20.2758C85.2317 21.1453 85.0522 21.7272 84.8846 22.7417C84.7171 23.7562 84.6714 24.3752 84.7508 25.3493C84.8291 26.3235 84.926 26.864 85.2785 27.6126C85.631 28.3601 85.9138 28.747 86.5133 29.0902C87.1127 29.4335 87.5142 29.4869 88.2747 29.3289C89.034 29.1709 89.4681 28.9377 90.3113 28.2991C91.1544 27.6606 91.6299 27.1953 92.4904 26.1361C93.351 25.0769 93.7916 24.3959 94.6152 23.0043C95.4399 21.6128 95.8642 20.7934 96.6105 19.1785C97.3557 17.5636 97.7343 16.6275 98.3447 14.9287C98.955 13.231 99.2259 12.2601 99.66 10.6844C100.095 9.1087 100.254 8.2947 100.517 7.05028C100.781 5.80695 100.889 5.24577 100.976 4.46446C101.062 3.68316 101.074 3.35626 100.952 3.14377C100.831 2.93128 100.571 2.98249 100.367 3.40202C100.165 3.82155 100.104 4.22364 99.9374 5.24141C99.7699 6.25808 99.685 7.00125 99.5327 8.48758C99.3804 9.9739 99.2879 10.9252 99.1748 12.672C99.0627 14.4187 99.0029 15.4681 98.9713 17.2214C98.9398 18.9758 98.9681 19.9271 99.0159 21.4396C99.0649 22.952 99.1051 23.7105 99.2139 24.7827C99.3238 25.855 99.3358 26.2985 99.5621 26.803C99.7873 27.3075 100.034 27.4198 100.343 27.3053C100.652 27.1909 100.794 26.8597 101.108 26.2287C101.421 25.5989 101.554 25.0933 101.913 24.1551C102.273 23.2157 102.507 22.5325 102.906 21.5333C103.306 20.534 103.57 19.9107 103.912 19.1589C104.253 18.4081 104.495 18.1008 104.614 17.776C104.735 17.4513 104.598 17.387 104.511 17.5352C104.425 17.6834 104.333 17.9537 104.184 18.517C104.035 19.0815 103.908 19.5718 103.766 20.3553C103.623 21.1399 103.522 21.6619 103.473 22.4388C103.425 23.2157 103.383 23.6516 103.522 24.2401C103.663 24.8274 103.801 25.1314 104.174 25.3766C104.548 25.6218 104.881 25.6043 105.39 25.4638C105.899 25.3243 106.174 25.0976 106.722 24.677C107.269 24.2564 107.603 23.8881 108.131 23.3607C108.658 22.8333 109.022 22.441 109.361 22.0389C109.7 21.6368 109.778 21.4374 109.825 21.3502C109.871 21.2619 109.693 21.2914 109.595 21.6008C109.497 21.9114 109.463 22.2557 109.335 22.8987C109.208 23.5427 109.048 24.0232 108.958 24.8187C108.868 25.6141 108.825 26.147 108.886 26.876C108.947 27.6061 109.054 27.9602 109.264 28.4658C109.473 28.9715 109.655 29.1643 109.935 29.4041C110.213 29.6449 110.481 29.6732 110.658 29.6689C110.835 29.6645 110.882 29.5228 110.821 29.3834C110.759 29.2428 110.561 29.1948 110.351 28.9671C110.141 28.7404 109.964 28.6729 109.771 28.2457C109.579 27.8197 109.444 27.5058 109.389 26.8346C109.335 26.1623 109.393 25.6501 109.499 24.8873C109.606 24.1245 109.78 23.668 109.921 23.0218C110.064 22.3756 110.246 22.0531 110.21 21.6553C110.175 21.2587 110.002 21.0451 109.743 21.0375C109.484 21.0298 109.318 21.2325 108.915 21.6172C108.512 22.0029 108.233 22.4377 107.727 22.9629C107.221 23.4882 106.884 23.8478 106.385 24.2411C105.884 24.6345 105.608 24.7958 105.226 24.932C104.844 25.0682 104.713 25.0835 104.473 24.9233C104.233 24.762 104.122 24.6182 104.023 24.1289C103.925 23.6385 103.919 23.2081 103.979 22.4748C104.039 21.7414 104.168 21.2293 104.322 20.4621C104.475 19.695 104.645 19.2308 104.748 18.6413C104.852 18.0517 104.947 17.739 104.839 17.5156C104.731 17.2922 104.471 17.2301 104.209 17.5243C103.947 17.8185 103.858 18.2163 103.527 18.9889C103.195 19.7625 102.951 20.388 102.55 21.3894C102.149 22.3919 101.89 23.0719 101.521 24.0014C101.152 24.9298 100.972 25.4409 100.703 26.0358C100.434 26.6308 100.338 26.8488 100.175 26.9773C100.011 27.1048 100.026 27.1223 99.8874 26.6777C99.7492 26.232 99.6132 25.8016 99.4827 24.7522C99.351 23.7028 99.2955 22.9368 99.2335 21.4319C99.1726 19.926 99.1432 18.9747 99.1748 17.2258C99.2074 15.4768 99.2683 14.4285 99.3956 12.6872C99.5218 10.9459 99.6306 9.99461 99.8101 8.51918C99.9907 7.04266 100.103 6.30167 100.294 5.30461C100.487 4.30864 100.69 3.95667 100.77 3.53823C100.849 3.1187 100.715 3.03153 100.694 3.21024C100.671 3.38786 100.739 3.67117 100.658 4.42959C100.575 5.18801 100.521 5.76228 100.282 7.00343C100.044 8.24349 99.8885 9.05857 99.4642 10.631C99.0409 12.2034 98.7711 13.1721 98.1641 14.8644C97.5581 16.5567 97.1784 17.4895 96.4299 19.0946C95.6825 20.6997 95.2538 21.5148 94.4248 22.8899C93.5958 24.264 93.1465 24.9353 92.2848 25.9661C91.4243 26.9969 90.9379 27.4415 90.1209 28.042C89.3038 28.6435 88.8839 28.8298 88.1996 28.9725C87.5164 29.1164 87.2215 29.0641 86.7037 28.7612C86.1858 28.4571 85.9323 28.1433 85.6125 27.4557C85.2926 26.767 85.1773 26.2516 85.1033 25.321C85.0282 24.3904 85.0685 23.7802 85.2404 22.8028C85.4112 21.8253 85.5951 21.2554 85.9573 20.4338C86.3207 19.6122 86.6003 19.2438 87.0529 18.6946C87.5055 18.1454 87.8036 17.9526 88.2203 17.6856C88.6369 17.4186 88.8371 17.4154 89.1341 17.3587C89.4311 17.302 89.516 17.4099 89.7053 17.4001C89.8946 17.3914 89.9588 17.3718 90.0796 17.3129C90.2014 17.2541 90.2558 17.2225 90.3135 17.107C90.3711 16.9904 90.3929 16.8629 90.37 16.7343Z" fill="black" stroke="black"/></svg>`

  function smoothScrollLink(href) {
    if (href.startsWith('#')) {
      // Smooth-scroll when the target is on the current page; otherwise fall back to
      // the home page with the hash (e.g. clicking "Talks" from the book page).
      return `href="/${href}" onclick="var el=document.querySelector('${href}'); if (el) { event.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }"`
    }
    return `href="${href}"`
  }

  placeholder.outerHTML = `
    <header class="relative">
      <div class="max-w-[1120px] w-full mx-auto px-6 md:px-10 h-20 md:h-[104px] flex items-center justify-between">
        <a href="/" class="flex items-center">${logoSvg}</a>
        <nav class="flex items-center gap-6">
          ${(nav?.links || []).map(link =>
            `<a ${smoothScrollLink(link.url)} class="font-arial font-semibold text-[16px] text-black/55 hover:text-black transition-colors">${link.text}</a>`
          ).join('')}
          <a href="#" onclick="event.preventDefault(); Alpine.store('contactModal').openModal()"
             class="hidden md:inline font-arial font-semibold text-[16px] text-black underline decoration-solid decoration-[1px] underline-offset-[3px] decoration-skip-ink-none hover:opacity-70 transition-opacity">
            ${nav?.ctaText || 'Check availability'}
          </a>
        </nav>
      </div>
    </header>
  `
}

function injectFooter() {
  const placeholder = document.getElementById('footer-placeholder')
  if (!placeholder) return

  const footer = siteContent.footer
  if (!footer) return

  const linksHtml = (footer.links || []).map(link => `
    <a href="${link.url}" class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-white underline decoration-solid underline-offset-[3px] decoration-skip-ink-none hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">${link.text}</a>
  `).join('')

  placeholder.outerHTML = `
    <div class="flex flex-wrap gap-6 items-start">
      ${linksHtml}
    </div>
  `
}

function injectModal() {
  // Only inject if not already present
  if (document.querySelector('[x-data="contactModal"]')) return

  const modalHtml = `
    <div x-data="contactModal" x-cloak data-alpine-inject>
      <div
        x-show="$store.contactModal.open"
        x-transition:enter="transition-all ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition-all ease-in duration-200"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="modal-container"
        @click="if (!submitting && !success) closeModal()"
      >
        <div class="modal-content" @click.stop role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button type="button" @click="closeModal()" :disabled="submitting || success"
            :class="(submitting || success) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'"
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center z-10" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="20" height="20" class="text-black">
              <rect x="1" y="1" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="4" y="4" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="7" y="7" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="10" y="10" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="13" y="13" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="13" y="1" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="10" y="4" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="4" y="10" width="2.5" height="2.5" fill="currentColor"/>
              <rect x="1" y="13" width="2.5" height="2.5" fill="currentColor"/>
            </svg>
          </button>
          <div class="p-6 md:p-10 space-y-8 md:space-y-10">
            <div class="space-y-6 md:space-y-8">
              <div class="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center" id="modal-icon"></div>
              <div class="space-y-4 md:space-y-5">
                <div class="space-y-2 md:space-y-3">
                  <h3 class="font-arial font-semibold text-[24px] md:text-[28px] leading-[1.3] text-black" id="modal-title"></h3>
                  <p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-black" id="modal-description"></p>
                </div>
              </div>
            </div>
            <form @submit="submitForm($event)" class="space-y-0">
              <input type="hidden" name="selectedTalk" id="selectedTalk" value="">
              <div class="relative">
                <input type="text" id="name" name="name" required placeholder="Name" :disabled="submitting || success" :class="(submitting || success) ? 'opacity-50 cursor-not-allowed' : ''" class="w-full h-11 md:h-12 px-3 py-0 border-2 border-transparent rounded-md focus:border-black focus:outline-none transition-all font-arial text-[18px] md:text-[20px] text-black placeholder-gray-600" style="box-shadow: inset 0 0 0 1px #D1D5DB;" onfocus="this.style.boxShadow='none'; this.style.borderColor='#000000';" onblur="this.style.boxShadow='inset 0 0 0 1px #D1D5DB'; this.style.borderColor='transparent';">
              </div>
              <div class="relative" style="margin-top: 12px;">
                <input type="email" id="email" name="email" required placeholder="Work e-mail" :disabled="submitting || success" :class="(submitting || success) ? 'opacity-50 cursor-not-allowed' : ''" class="w-full h-11 md:h-12 px-3 py-0 border-2 border-transparent rounded-md focus:border-black focus:outline-none transition-all font-arial text-[18px] md:text-[20px] text-black placeholder-gray-600" style="box-shadow: inset 0 0 0 1px #D1D5DB;" onfocus="this.style.boxShadow='none'; this.style.borderColor='#000000';" onblur="this.style.boxShadow='inset 0 0 0 1px #D1D5DB'; this.style.borderColor='transparent';">
              </div>
              <div class="relative" style="margin-top: 12px;">
                <input type="tel" id="phone" name="phone" placeholder="Phone" :disabled="submitting || success" :class="(submitting || success) ? 'opacity-50 cursor-not-allowed' : ''" class="w-full h-11 md:h-12 px-3 py-0 border-2 border-transparent rounded-md focus:border-black focus:outline-none transition-all font-arial text-[18px] md:text-[20px] text-black placeholder-gray-600" style="box-shadow: inset 0 0 0 1px #D1D5DB;" onfocus="this.style.boxShadow='none'; this.style.borderColor='#000000';" onblur="this.style.boxShadow='inset 0 0 0 1px #D1D5DB'; this.style.borderColor='transparent';">
              </div>
              <div class="relative" style="margin-top: 12px;">
                <select id="eventType" name="eventType" :disabled="submitting || success" :class="(submitting || success) ? 'opacity-50 cursor-not-allowed' : ''" class="w-full h-11 md:h-12 px-3 pr-10 py-0 border-2 border-transparent rounded-md focus:border-black focus:outline-none transition-all font-arial text-[18px] md:text-[20px] text-black bg-white appearance-none" style="box-shadow: inset 0 0 0 1px #D1D5DB;" onfocus="this.style.boxShadow='none'; this.style.borderColor='#000000';" onblur="this.style.boxShadow='inset 0 0 0 1px #D1D5DB'; this.style.borderColor='transparent';">
                  <option value="" class="text-gray-600">Event type</option>
                </select>
                <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="relative" style="margin-top: 12px;">
                <textarea id="message" name="message" rows="3" placeholder="Tell us about your event (optional)" :disabled="submitting || success" :class="(submitting || success) ? 'opacity-50 cursor-not-allowed' : ''" class="w-full px-3 py-2.5 border-2 border-transparent rounded-md focus:border-black focus:outline-none transition-all font-arial text-[18px] md:text-[20px] text-black placeholder-gray-600 resize-none" style="box-shadow: inset 0 0 0 1px #D1D5DB;" onfocus="this.style.boxShadow='none'; this.style.borderColor='#000000';" onblur="this.style.boxShadow='inset 0 0 0 1px #D1D5DB'; this.style.borderColor='transparent';"></textarea>
              </div>
              <button type="submit" :disabled="submitting || success" :class="submitting || success ? 'bg-neutral-700' : 'bg-black hover:bg-neutral-800'" class="w-full h-11 md:h-12 rounded-md flex items-center justify-center gap-2 px-6 transition-colors" style="margin-top: 20px;">
                <span x-show="!submitting && !success" class="font-arial font-semibold text-[18px] md:text-[20px] leading-[1.4] text-white">Send request</span>
                <div x-show="!submitting && !success" class="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center transform rotate-180 scale-y-[-1]" id="submit-icon"></div>
                <div x-show="submitting" class="animate-spin rounded-full h-4 md:h-5 w-4 md:w-5 border-2 border-white border-t-transparent"></div>
                <span x-show="success" class="font-arial text-[18px] md:text-[20px] leading-[1.4] text-white">Success!</span>
              </button>
            </form>
            <div style="margin-top: 20px;">
              <p class="font-arial text-[16px] md:text-[18px] leading-[1.3] text-gray-500 text-center" id="modal-subtitle-main">Frederick's team typically responds within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

function injectStickyCta() {
  if (document.querySelector('[x-data="stickyCta"]')) return

  const stickyHtml = `
    <div x-data="stickyCta" x-show="visible" x-cloak data-alpine-inject
         x-transition:enter="transition-all ease-out duration-300"
         x-transition:enter-start="opacity-0 translate-y-full"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition-all ease-in duration-200"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 translate-y-full"
         class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-3 shadow-lg">
      <div class="max-w-[1120px] w-full mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
        <span id="sticky-cta-text" class="font-arial font-semibold text-[16px] md:text-[18px] leading-[1.3] text-black hidden md:block"></span>
        <button @click="$store.contactModal.openModal()"
                class="w-full md:w-auto bg-black hover:bg-neutral-800 text-white font-arial font-semibold text-[16px] md:text-[18px] leading-[1.4] px-6 py-2.5 rounded-md transition-colors">
          Check availability
        </button>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', stickyHtml)
}

// ── Content Population Router ───────────────────────────────────────

function populateContent() {
  // Populate event type dropdown (shared, inside injected modal)
  const eventTypeSelect = document.getElementById('eventType')
  if (eventTypeSelect && siteContent.booking?.modal?.eventTypes) {
    const defaultOption = eventTypeSelect.querySelector('option[value=""]')
    eventTypeSelect.innerHTML = ''
    if (defaultOption) eventTypeSelect.appendChild(defaultOption)
    siteContent.booking.modal.eventTypes.forEach(type => {
      const option = document.createElement('option')
      option.value = type
      option.textContent = type
      eventTypeSelect.appendChild(option)
    })
  }

  // Populate sticky CTA text (shared)
  const stickyCtatext = document.getElementById('sticky-cta-text')
  if (stickyCtatext && siteContent.booking?.ctaText) {
    stickyCtatext.textContent = siteContent.booking.ctaText
  }

  // Route to page-specific populator
  if (isPage('/')) {
    populateHome()
  } else if (isPage('/talks')) {
    populateTalksPage()
  } else if (isPage('/book')) {
    populateBookPage()
  } else if (isPage('/about')) {
    populateAboutPage()
  }

  // Populate booking CTA section (shared across pages that have it)
  populateBookingCta()
}

// ── Home Page ───────────────────────────────────────────────────────

function populateHome() {
  const setText = (selector, text) => {
    const element = document.querySelector(selector)
    if (element && text) element.textContent = text
  }

  const setRichText = (selector, content) => {
    const element = document.querySelector(selector)
    if (!element) return
    if (typeof content === 'string') { element.textContent = content; return }
    if (content?.content && content?.links) {
      let html = content.content
      Object.entries(content.links).forEach(([key, linkData]) => {
        const placeholder = `{${key}}`
        let linkHtml
        if (linkData.style === 'black') {
          linkHtml = `<a href="${linkData.url}" class="font-semibold text-black underline decoration-solid decoration-[1px] underline-offset-[3px] decoration-skip-ink-none hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">${linkData.text}</a>`
        } else {
          const icon = linkData.icon ? `<span class="mr-1 md:mr-1.5 inline-flex items-center">${linkData.icon}</span>` : ''
          linkHtml = `<a href="${linkData.url}" class="custom-underline inline-flex items-center font-semibold" target="_blank" rel="noopener noreferrer">${icon}${linkData.text}</a>`
        }
        html = html.replace(placeholder, linkHtml)
      })
      element.innerHTML = html
    }
  }

  // Hero headline + subtext
  setText('[data-content="hero.intro.text1"]', siteContent.hero?.intro?.text1)
  setRichText('[data-content="hero.intro.text2"]', siteContent.hero?.intro?.text2)

  // Config callout
  if (siteContent.hero?.configCallout?.show) {
    const callout = document.getElementById('config-callout')
    const calloutLink = document.getElementById('config-callout-link')
    const calloutText = document.getElementById('config-callout-text')
    if (callout && calloutText) {
      calloutText.innerHTML = siteContent.hero.configCallout.text
      if (calloutLink && siteContent.hero.configCallout.url) calloutLink.href = siteContent.hero.configCallout.url
      callout.classList.remove('hidden')
    }
  }

  // Talks (2-column grid with icons)
  const talksContainer = document.querySelector('#talks-container')
  const tp = siteContent.homePage?.talksPreview
  if (talksContainer && siteContent.talks) {
    let talksHtml = ''
    if (tp?.title) {
      talksHtml += `<div class="mb-10 md:mb-14 space-y-3 md:space-y-4">
        <h2 class="font-semibold text-[28px] md:text-[40px] leading-[1.1] text-black">${tp.title}</h2>
        ${tp.customTalkText ? `<p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-[#555] max-w-[600px]">${tp.customTalkText} <a href="#" onclick="event.preventDefault(); Alpine.store('contactModal').openModal()" class="font-semibold text-black underline decoration-solid underline-offset-[3px] decoration-skip-ink-none hover:text-black/60 transition-colors">${tp.customTalkCta || 'Send a request'}</a></p>` : ''}
      </div>`
    }
    talksHtml += `<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 gap-y-10 md:gap-y-20 relative">`
    const nonCustomTalks = siteContent.talks.filter(t => !t.isCustom)
    const gridPos = ['md:col-start-1 md:row-start-1', 'md:col-start-2 md:row-start-1', 'md:col-start-2 md:row-start-2']
    talksHtml += nonCustomTalks.map((talk, i) => `
      <div class="space-y-4 talk-card ${gridPos[i] || ''}" data-talk-id="${talk.id}">
        ${talk.modal?.icon ? `<div class="w-14 h-14 flex items-center justify-center talk-icon">${talk.modal.icon}</div>` : ''}
        <h3><a href="#" class="talk-action-btn block font-semibold text-[20px] md:text-[24px] leading-[1.3] text-black underline decoration-solid underline-offset-[3px] decoration-skip-ink-none hover:text-black/60 transition-colors" data-talk-id="${talk.id}">${talk.title}</a></h3>
        <p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-black max-w-[480px]">${talk.description}</p>
        <div class="flex flex-wrap items-start gap-4" x-data data-alpine-inject>
          ${(talk.tags || []).map(tag => `
            <span class="relative font-arial text-[16px] md:text-[18px] leading-[1.1] text-[#555] underline decoration-dotted decoration-[2px] underline-offset-[3px] cursor-help"
                  x-data="tooltip"
                  data-tooltip="${(tag.tooltip || '').replace(/"/g, '&quot;')}"
                  ${tag.tooltipIcon ? `data-tooltip-icon="${tag.tooltipIcon.replace(/"/g, '&quot;')}"` : ''}>${tag.text}
              <div x-show="show" x-ref="tooltip"
                   x-transition:enter="tooltip-enter" x-transition:enter-start="tooltip-enter" x-transition:enter-end="tooltip-enter-to"
                   x-transition:leave="tooltip-leave" x-transition:leave-start="tooltip-leave" x-transition:leave-end="tooltip-leave-to"
                   class="custom-tooltip">
                <div class="flex flex-col items-start gap-2">
                  <div x-show="icon" x-html="icon" class="flex-shrink-0"></div>
                  <span x-text="content" class="text-left"></span>
                </div>
              </div>
            </span>
          `).join('')}
          ${talk.duration ? `<span class="flex items-center gap-1.5 font-arial text-[16px] md:text-[18px] leading-[1.1] text-[#555]"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 6.75V5.25H15.75V3.75H15V3H14.25V2.25H12.75V1.5H11.25V0.75H6.75V1.5H5.25V2.25H3.75V3H3V3.75H2.25V5.25H1.5V6.75H0.75V11.25H1.5V12.75H2.25V14.25H3V15H3.75V15.75H5.25V16.5H6.75V17.25H11.25V16.5H12.75V15.75H14.25V15H15V14.25H15.75V12.75H16.5V11.25H17.25V6.75H16.5ZM15.75 11.25H15V12.75H14.25V14.25H12.75V15H11.25V15.75H6.75V15H5.25V14.25H3.75V12.75H3V11.25H2.25V6.75H3V5.25H3.75V3.75H5.25V3H6.75V2.25H11.25V3H12.75V3.75H14.25V5.25H15V6.75H15.75V11.25Z" fill="#777"/><path d="M12 11.25V12H11.25V12.75H10.5V12H9.75V11.25H9V10.5H8.25V3.75H9.75V9.75H10.5V10.5H11.25V11.25H12Z" fill="#777"/></svg>${talk.duration}</span>` : ''}
        </div>
      </div>
    `).join('')
    talksHtml += `</div>`
    talksContainer.innerHTML = talksHtml
    // Initialize Alpine on newly injected tooltip elements
    talksContainer.querySelectorAll('[data-alpine-inject]').forEach(el => {
      Alpine.initTree(el)
    })
  }

  // Value props section
  const valuePropsContent = document.getElementById('value-props-content')
  const vp = siteContent.homePage?.valueProps
  if (valuePropsContent && vp) {
    let vpHtml = ''
    if (vp.title) {
      vpHtml += `<h2 class="font-semibold text-[28px] md:text-[36px] leading-[1.1] text-black mb-10 md:mb-14">${vp.title}</h2>`
    }
    vpHtml += `<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">`
    vpHtml += (vp.items || []).map((item, i) => `
      <div class="space-y-4">
        <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-[16px]">${i + 1}</div>
        <h3 class="font-semibold text-[20px] md:text-[24px] leading-[1.2] text-black">${item.title}</h3>
        <p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-black max-w-[480px]">${item.description}</p>
      </div>
    `).join('')
    vpHtml += `</div>`
    valuePropsContent.innerHTML = vpHtml
  }

  // Social proof
  populateSocialProof()

  // Image carousel
  populateImages()
}

// ── Talks Page ──────────────────────────────────────────────────────

function populateTalksPage() {
  // Title & subtitle from content
  const tp = siteContent.talksPage
  if (tp) {
    const title = document.getElementById('talks-page-title')
    const subtitle = document.getElementById('talks-page-subtitle')
    if (title && tp.title) title.textContent = tp.title
    if (subtitle && tp.subtitle) subtitle.textContent = tp.subtitle
  }

  // Full talk cards
  const container = document.getElementById('talks-full-container')
  if (container && siteContent.talks) {
    container.innerHTML = siteContent.talks.map(talk => {
      const imageHtml = `
        <div class="image-placeholder bg-gray-200 rounded-md aspect-[16/9] max-w-sm mt-4 flex items-center justify-center">
          <span>Frederick delivering "${talk.title}" session</span>
        </div>`

      return `
        <section class="pt-8 md:pt-12 pb-12 md:pb-16 talk-section">
          <div class="space-y-6 md:space-y-8">
            <div class="space-y-3 md:space-y-4">
              ${renderTalkHeader(talk)}
              <p class="font-arial text-body md:text-[24px] leading-[1.3] text-black max-w-[680px]">${talk.description}</p>
              ${renderFormatPills(talk)}
              ${talk.audienceFit ? `<p class="font-arial text-[14px] md:text-[16px] leading-[1.4] text-gray-500">${talk.audienceFit}</p>` : ''}
            </div>
            ${renderTags(talk)}
            ${!talk.isCustom ? imageHtml : ''}
          </div>
        </section>`
    }).join('')
  }
}

// ── Book Page ───────────────────────────────────────────────────────

// Drives the "A look inside" carousel: an infinite, seamless left-scroll that
// starts with the first image centered on screen. The track holds three sets
// (lead clones / real / trailing clones); we offset it so the first real image
// is centered, then animate by exactly one set width for a seamless loop.
function initGalleryMarquee(track, setSize) {
  if (!track || !setSize) return
  // Respect reduced motion: leave the CSS fallback (no animation, manual scroll).
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  track.style.animation = 'none' // disable the CSS marquee; we drive it via WAAPI
  const SPEED = 110 // px per second
  let anim = null

  const run = () => {
    if (anim) { anim.cancel(); anim = null }
    const figs = track.querySelectorAll('figure')
    if (figs.length < setSize * 3) return
    const first = figs[setSize]        // first image of the real (middle) set
    const next = figs[setSize * 2]     // same image, one set later
    const period = next.offsetLeft - first.offsetLeft
    if (period <= 0) return
    const center = window.innerWidth / 2 - first.offsetWidth / 2 - first.offsetLeft
    anim = track.animate(
      [{ transform: `translateX(${center}px)` }, { transform: `translateX(${center - period}px)` }],
      { duration: (period / SPEED) * 1000, iterations: Infinity, easing: 'linear' }
    )
  }

  const imgs = [...track.querySelectorAll('img')]
  Promise.all(imgs.map(img => (img.complete && img.naturalWidth)
    ? Promise.resolve()
    : new Promise(res => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }) })
  )).then(run)

  const wrap = track.closest('.book-marquee')
  if (wrap) {
    wrap.addEventListener('mouseenter', () => { if (anim) anim.pause() })
    wrap.addEventListener('mouseleave', () => { if (anim) anim.play() })
  }
  let resizeTimer
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(run, 200) }, { passive: true })
}

function populateBookPage() {
  const bp = siteContent.bookPage
  if (!bp) return

  const setText = (id, value) => { const el = document.getElementById(id); if (el && value) el.textContent = value }

  setText('book-page-eyebrow', bp.eyebrow)
  setText('book-page-title', bp.title)
  setText('book-page-subtitle', bp.subtitle)
  setText('book-toc-title', bp.tocTitle)
  setText('book-author-bio', bp.authorBio)

  // Cover image
  const cover = document.getElementById('book-cover-image')
  if (cover && bp.coverImage && bp.coverImage.url) {
    cover.src = bp.coverImage.url
    if (bp.coverImage.alt) cover.alt = bp.coverImage.alt
  }

  // Email form copy
  if (bp.form) {
    setText('book-form-heading', bp.form.heading)
  }

  // Pull-quote band
  if (bp.quote) {
    setText('book-quote-text', bp.quote.text)
    setText('book-quote-attribution', bp.quote.attribution)
  }

  // TOC intro
  setText('book-toc-intro', bp.tocIntro)

  // "A look inside" carousel
  if (bp.gallery) {
    setText('book-gallery-title', bp.gallery.title)
    setText('book-gallery-subtitle', bp.gallery.subtitle)
    const galleryContainer = document.getElementById('book-gallery')
    if (galleryContainer && bp.gallery.items) {
      // Uniform height; width follows each image's natural aspect ratio, so
      // portrait images render portrait and landscape images render landscape.
      const slideHeight = 'h-[380px] sm:h-[540px] lg:h-[780px]'
      const buildSlide = (item, i, clone) => {
        const inner = item && item.url
          ? `<img src="${item.url}" alt="${clone ? '' : (item.alt || '')}" class="${slideHeight} w-auto object-cover bg-gray-200" loading="eager" decoding="async">`
          : `<div class="${slideHeight} aspect-video flex items-center justify-center bg-gray-200 text-gray-400 font-arial text-[16px] md:text-[18px]">Image ${i + 1}</div>`
        return `<figure class="shrink-0"${clone ? ' aria-hidden="true"' : ''}>
          ${inner}
          ${item && item.caption ? `<figcaption class="font-arial text-[14px] md:text-[15px] leading-[1.4] text-gray-500 mt-3">${item.caption}</figcaption>` : ''}
        </figure>`
      }
      // Three sets: a leading clone set keeps the left filled when the strip
      // is offset so the first image can start centered, then the real set,
      // then a trailing clone set for the seamless loop.
      const lead = bp.gallery.items.map((item, i) => buildSlide(item, i, true)).join('')
      const real = bp.gallery.items.map((item, i) => buildSlide(item, i, false)).join('')
      const trail = bp.gallery.items.map((item, i) => buildSlide(item, i, true)).join('')
      galleryContainer.innerHTML = lead + real + trail
      initGalleryMarquee(galleryContainer, bp.gallery.items.length)
    }
  }

  // Closing CTA
  if (bp.closingCta) {
    setText('book-closing-heading', bp.closingCta.heading)
    setText('book-closing-subheading', bp.closingCta.subheading)
  }

  // Pitch paragraphs
  const pitchContainer = document.getElementById('book-page-pitch')
  if (pitchContainer && bp.pitch) {
    pitchContainer.innerHTML = bp.pitch.map(p =>
      `<p class="font-arial text-body md:text-[20px] leading-[1.4] text-black">${p}</p>`
    ).join('')
  }

  // Benefits ("What you'll take away")
  const benefitsTitle = document.getElementById('book-benefits-title')
  if (benefitsTitle && bp.benefits && bp.benefits.title) benefitsTitle.textContent = bp.benefits.title
  const benefitsContainer = document.getElementById('book-benefits')
  if (benefitsContainer && bp.benefits && bp.benefits.items) {
    benefitsContainer.innerHTML = bp.benefits.items.map((item, i) =>
      `<div class="space-y-4">
        <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-[16px]">${i + 1}</div>
        <h3 class="font-semibold text-[20px] md:text-[24px] leading-[1.2] text-black">${item.title}</h3>
        <p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-black max-w-[480px]">${item.description}</p>
      </div>`
    ).join('')
  }

  // Table of contents (supports plain strings or { title, summary } objects)
  const tocContainer = document.getElementById('book-page-toc')
  if (tocContainer && bp.toc) {
    tocContainer.innerHTML = bp.toc.map((item, i) => {
      const title = typeof item === 'string' ? item : item.title
      const summary = typeof item === 'object' && item ? item.summary : ''
      return `<div class="flex items-baseline gap-4 md:gap-6 py-5 ${i < bp.toc.length - 1 ? 'border-b border-gray-100' : ''}">
        <span class="font-arial text-[14px] md:text-[16px] text-gray-400 flex-shrink-0 w-6">${String(i + 1).padStart(2, '0')}</span>
        <div class="space-y-1">
          <span class="block font-arial font-medium text-[18px] md:text-[22px] leading-[1.3] text-black">${title}</span>
          ${summary ? `<span class="block font-arial text-[15px] md:text-[17px] leading-[1.4] text-gray-500">${summary}</span>` : ''}
        </div>
      </div>`
    }).join('')
  }

  // Endorsements
  if (bp.endorsements && bp.endorsements.some(e => e.quote)) {
    const section = document.getElementById('book-endorsements-section')
    const container = document.getElementById('book-endorsements-content')
    if (section && container) {
      container.innerHTML = bp.endorsements.filter(e => e.quote).map(e =>
        `<blockquote class="border-l-2 border-primary-500 pl-6 py-2 mb-8">
          <p class="font-times text-[20px] md:text-[24px] leading-[1.4] text-black italic">"${e.quote}"</p>
          ${e.name ? `<footer class="mt-3 font-arial text-[16px] md:text-[18px] text-gray-500">
            <span class="font-semibold text-black">${e.name}</span>${e.title ? `, ${e.title}` : ''}${e.org ? ` at ${e.org}` : ''}
          </footer>` : ''}
        </blockquote>`
      ).join('')
      section.classList.remove('hidden')
    }
  }
}

// ── About Page ──────────────────────────────────────────────────────

function populateAboutPage() {
  const ap = siteContent.aboutPage
  if (!ap) return

  const title = document.getElementById('about-page-title')
  if (title && ap.title) title.textContent = ap.title

  // Bio paragraphs
  const bioContainer = document.getElementById('about-bio-content')
  if (bioContainer && ap.bio) {
    bioContainer.innerHTML = ap.bio.map(p =>
      `<p class="font-arial text-body md:text-[24px] leading-[1.3] text-black">${p}</p>`
    ).join('')
  }

  // Studio
  const studioDesc = document.getElementById('about-studio-description')
  if (studioDesc && ap.studioDescription) studioDesc.textContent = ap.studioDescription
  const studioLink = document.getElementById('about-studio-link')
  if (studioLink && ap.studioUrl) studioLink.href = ap.studioUrl

  // Philosophy
  const philosophy = document.getElementById('about-philosophy')
  if (philosophy && ap.philosophy) philosophy.textContent = ap.philosophy

  // Photo grid (replace with real images from content if provided)
  if (ap.photos) {
    const grid = document.getElementById('about-photo-grid')
    if (grid) {
      grid.innerHTML = ap.photos.map(photo => {
        if (photo.url) {
          return `<div class="rounded-md aspect-[4/3] overflow-hidden">
            <img src="${photo.url}" alt="${photo.alt || ''}" class="w-full h-full object-cover">
          </div>`
        }
        return `<div class="image-placeholder bg-gray-200 rounded-md aspect-[4/3] flex items-center justify-center">
          <span>${photo.placeholder || photo.alt || 'Photo'}</span>
        </div>`
      }).join('')
    }
  }
}

// ── Shared Talk Rendering Helpers ───────────────────────────────────

function renderTalkHeader(talk) {
  if (talk.isCustom) {
    return `<h2>
      <a href="#" class="talk-title-link font-arial font-semibold text-body md:text-body-md leading-[1.3] text-primary-500 underline decoration-solid underline-offset-[3px] decoration-skip-ink-none cursor-pointer talk-action-btn"
         data-talk-id="${talk.id}" data-action="primary">${talk.title}</a>
    </h2>`
  }
  return `<div class="flex items-center gap-2 md:gap-2.5">
    <div class="w-7 md:w-8 h-7 md:h-8 rounded-full border border-primary-500 flex items-center justify-center">
      <span class="font-arial text-[18px] md:text-[20px] leading-[1.1] text-primary-500 uppercase">${talk.id}</span>
    </div>
    <h2 class="flex-1 min-w-0">
      <a href="#" class="talk-title-link font-arial font-semibold text-body md:text-body-md leading-[1.3] text-primary-500 underline decoration-solid underline-offset-[3px] decoration-skip-ink-none cursor-pointer talk-action-btn"
         data-talk-id="${talk.id}" data-action="primary">${talk.title}</a>
    </h2>
  </div>`
}

function renderFormatPills(talk) {
  if (!talk.formats || talk.formats.length === 0) return ''
  return `<div class="flex flex-wrap gap-2 mt-3">
    ${talk.formats.map(f => `<span class="format-pill">${f}</span>`).join('')}
    ${talk.duration ? `<span class="font-arial text-[14px] md:text-[16px] leading-[1.4] text-gray-500">${talk.duration}</span>` : ''}
  </div>`
}

function renderTags(talk) {
  if (!talk.tags || talk.tags.length === 0) return ''
  return `<div class="flex gap-3 md:gap-4 items-center">
    ${talk.tags.map(tag => `
      <span class="relative font-arial text-[16px] md:text-[18px] leading-[1.4] text-gray-500 underline decoration-dotted underline-offset-[3px] cursor-help"
            x-data="tooltip"
            data-tooltip="${tag.tooltip || ''}"
            ${tag.tooltipIcon ? `data-tooltip-icon="${tag.tooltipIcon.replace(/"/g, '&quot;')}"` : ''}>${tag.text}
        <div x-show="show" x-ref="tooltip"
             x-transition:enter="tooltip-enter" x-transition:enter-start="tooltip-enter" x-transition:enter-end="tooltip-enter-to"
             x-transition:leave="tooltip-leave" x-transition:leave-start="tooltip-leave" x-transition:leave-end="tooltip-leave-to"
             class="custom-tooltip">
          <div class="flex flex-col items-start gap-2">
            <div x-show="icon" x-html="icon" class="flex-shrink-0"></div>
            <span x-text="content" class="text-left"></span>
          </div>
        </div>
      </span>
    `).join('')}
  </div>`
}

// ── Shared Section Populators ───────────────────────────────────────

function populateSocialProof() {
  const container = document.getElementById('social-proof-content')
  const section = document.getElementById('social-proof-section')
  if (!container || !siteContent.socialProof) { if (section) section.style.display = 'none'; return }

  const sp = siteContent.socialProof
  if (!sp.showStats && !sp.showConferences) { section.style.display = 'none'; return }

  const figmaLogoSvg = `<svg width="92" height="26" viewBox="0 0 92 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.179688 6.15227C0.179688 2.94523 2.79789 0.345337 6.0275 0.345337H19.9225C23.1523 0.345337 25.7705 2.94523 25.7705 6.15227V19.9501C25.7705 23.1573 23.1523 25.7572 19.9225 25.7572H6.0275C2.79789 25.7572 0.179688 23.1573 0.179688 19.9501V6.15227Z" fill="black"/><path d="M6.97656 19.0071C6.97656 17.3625 8.31924 16.0292 9.9755 16.0292H12.9743V19.0071C12.9743 20.6518 11.6318 21.9851 9.9755 21.9851C8.31924 21.9851 6.97656 20.6518 6.97656 19.0071Z" fill="#24CB71"/><path d="M12.9746 4.11743V10.0732H15.9735C17.6298 10.0732 18.9725 8.74009 18.9725 7.09541C18.9725 5.45072 17.6298 4.11743 15.9735 4.11743H12.9746Z" fill="#FF7237"/><path d="M15.9481 16.0291C17.6044 16.0291 18.947 14.6959 18.947 13.0512C18.947 11.4065 17.6044 10.0732 15.9481 10.0732C14.2919 10.0732 12.9492 11.4065 12.9492 13.0512C12.9492 14.6959 14.2919 16.0291 15.9481 16.0291Z" fill="#00B6FF"/><path d="M6.97656 7.09541C6.97656 8.74009 8.31924 10.0734 9.9755 10.0734H12.9743V4.11743H9.9755C8.31924 4.11743 6.97656 5.45072 6.97656 7.09541Z" fill="#FF3737"/><path d="M6.97656 13.0512C6.97656 14.6959 8.31924 16.0292 9.9755 16.0292H12.9743V10.0734H9.9755C8.31924 10.0734 6.97656 11.4065 6.97656 13.0512Z" fill="#874FFF"/><path d="M86.1468 21.8134C85.3584 21.8134 84.6503 21.662 84.0229 21.3593C83.4113 21.0566 82.9206 20.6502 82.5505 20.1403C82.1965 19.6145 82.0195 19.0089 82.0195 18.3237C82.0195 17.4315 82.3092 16.7065 82.8884 16.1487C83.4677 15.591 84.2964 15.2087 85.3744 15.0015L88.1984 14.4278C88.7616 14.3163 89.1479 14.141 89.3569 13.902C89.5661 13.663 89.6708 13.3125 89.6708 12.8504L89.9605 15.6468L85.9055 16.5073C85.3584 16.6188 84.932 16.818 84.6263 17.1048C84.3366 17.3917 84.1918 17.79 84.1918 18.2998C84.1918 18.8258 84.3929 19.2479 84.7952 19.5667C85.2135 19.8854 85.7768 20.0448 86.4847 20.0448C87.0641 20.0448 87.595 19.9172 88.0777 19.6623C88.5766 19.4073 88.9627 19.0567 89.2364 18.6107C89.5259 18.1486 89.6708 17.6227 89.6708 17.0331V12.8504C89.6708 12.2766 89.4616 11.8306 89.0432 11.5118C88.641 11.1772 88.0859 11.0099 87.3778 11.0099C86.4767 11.0099 85.7848 11.233 85.3021 11.6792C84.8193 12.1253 84.5378 12.7547 84.4573 13.5674L82.3333 13.2806C82.4137 12.436 82.6712 11.711 83.1056 11.1056C83.5401 10.4841 84.1194 10.006 84.8435 9.67148C85.5676 9.33677 86.4284 9.16956 87.426 9.16956C88.842 9.16956 89.9283 9.52801 90.6844 10.2451C91.4408 10.9621 91.8189 11.8863 91.8189 13.0176V21.4548H89.7191V19.9013C89.5099 20.4271 89.0835 20.8813 88.4398 21.2637C87.8122 21.6302 87.0479 21.8134 86.1468 21.8134Z" fill="black"/><path d="M64.9062 21.4548V9.52801H67.0061V10.8666C67.1669 10.4045 67.521 10.006 68.0681 9.67148C68.6151 9.33677 69.2507 9.16956 69.9748 9.16956C70.6829 9.16956 71.3345 9.32084 71.9299 9.62356C72.5253 9.92642 72.9115 10.3806 73.0885 10.986C73.2977 10.4283 73.6838 9.99012 74.247 9.67148C74.8263 9.33677 75.47 9.16956 76.1779 9.16956C77.4009 9.16956 78.3342 9.52005 78.9778 10.2212C79.6214 10.9223 79.9432 11.9421 79.9432 13.2806V21.4548H77.7951V13.5674C77.7951 12.7706 77.6181 12.1731 77.2641 11.7747C76.9262 11.3605 76.4273 11.1534 75.7677 11.1534C75.0436 11.1534 74.4804 11.4083 74.078 11.9182C73.6919 12.4121 73.4988 13.1372 73.4988 14.0932V21.4548H71.3506V13.5674C71.3506 12.7706 71.1736 12.1731 70.8196 11.7747C70.4817 11.3605 69.9829 11.1534 69.3232 11.1534C68.5991 11.1534 68.0359 11.4083 67.6336 11.9182C67.2474 12.4121 67.0544 13.1372 67.0544 14.0932V21.4548H64.9062Z" fill="black"/><path d="M56.6936 25.7572C55.1972 25.7572 53.9822 25.4146 53.0489 24.7294C52.1156 24.0442 51.5204 23.0881 51.2629 21.8612L53.3628 21.4071C53.5397 22.1878 53.9179 22.7934 54.4971 23.2237C55.0764 23.6698 55.8086 23.8929 56.6936 23.8929C57.7555 23.8929 58.5521 23.6219 59.083 23.0802C59.6301 22.5544 59.9038 21.7657 59.9038 20.7139V18.8258C59.6623 19.4153 59.2117 19.8933 58.5521 20.2598C57.9084 20.6263 57.1843 20.8096 56.3797 20.8096C55.3177 20.8096 54.3846 20.5706 53.58 20.0925C52.7754 19.5986 52.1478 18.9134 51.6973 18.0369C51.2467 17.1606 51.0215 16.1487 51.0215 15.0015C51.0215 13.8383 51.2467 12.8185 51.6973 11.9421C52.1478 11.0656 52.7674 10.3885 53.5558 9.91049C54.3604 9.41654 55.3017 9.16956 56.3797 9.16956C57.1843 9.16956 57.9164 9.35269 58.5763 9.71925C59.252 10.0697 59.7106 10.508 59.952 11.0338V9.52801H62.0519V20.7139C62.0519 21.7657 61.8427 22.6658 61.4243 23.4149C61.0059 24.1797 60.3945 24.7613 59.5899 25.1597C58.8015 25.5579 57.836 25.7572 56.6936 25.7572ZM56.6452 18.9213C57.6752 18.9213 58.4958 18.5627 59.1072 17.8457C59.7348 17.1286 60.0485 16.1807 60.0485 15.0015C60.0485 13.8064 59.7348 12.8504 59.1072 12.1333C58.4796 11.4163 57.659 11.0577 56.6452 11.0577C55.6154 11.0577 54.7868 11.4163 54.1592 12.1333C53.5478 12.8504 53.2421 13.8064 53.2421 15.0015C53.2421 16.1807 53.5558 17.1286 54.1834 17.8457C54.811 18.5627 55.6316 18.9213 56.6452 18.9213Z" fill="black"/><path d="M46.6862 21.4409V9.52804H48.8344V21.4549L46.6862 21.4409ZM46.6621 7.99839V4.60437H48.8585V7.99839H46.6621Z" fill="black"/><path d="M34.3477 21.4549V4.60437H36.6165V21.4549H34.3477ZM34.8063 14.3323V12.3006H44.0505V14.3323H34.8063ZM34.8063 6.65983V4.60437H44.9436V6.65983H34.8063Z" fill="black"/></svg>`

  let html = ''
  if (sp.sectionTitle) html += `<p class="font-semibold text-[14px] leading-[1.4] text-black mb-4">${sp.sectionTitle}</p>`

  // Stats list — constrained to 400px on desktop, full-width on mobile
  html += `<div class="flex flex-col gap-4 w-full">`

  // Top divider
  html += `<div class="h-px bg-gray-200 w-full"></div>`

  if (sp.showStats && sp.stats?.length > 0) {
    sp.stats.forEach(stat => {
      html += `
        <div class="flex items-center gap-6">
          <span class="font-semibold text-[36px] leading-[1.1] text-black tracking-[-0.01em] w-[92px] shrink-0">${stat.value}</span>
          <span class="font-arial text-[16px] leading-[1.4] text-[#666] flex-1">${stat.label}</span>
        </div>
        <div class="h-px bg-gray-200 w-full"></div>`
    })
  }

  // Figma Config row
  if (sp.showConferences && sp.conferences?.length > 0) {
    sp.conferences.forEach(conf => {
      html += `
        <div class="flex items-center gap-6">
          <div class="w-[92px] h-[40px] shrink-0 flex items-center overflow-hidden">${figmaLogoSvg}</div>
          <span class="font-arial text-[16px] leading-[1.4] text-[#666]">${conf.name.replace('Figma ', '')} in San Francisco.</span>
        </div>`
    })
  }

  html += `</div>`

  container.innerHTML = html
}

function populateBookingCta() {
  const container = document.getElementById('booking-content')
  if (!container || !siteContent.booking) return

  let html = `<h2 class="font-semibold text-[28px] md:text-[40px] leading-[1.1] text-white">${siteContent.booking.ctaText}</h2>`
  if (siteContent.booking.ctaDescription) {
    html += `<p class="font-arial text-[18px] md:text-[20px] leading-[1.3] text-white/70 max-w-[560px] mx-auto">${siteContent.booking.ctaDescription}</p>`
  }
  html += `<div>
    <a href="#" onclick="event.preventDefault(); Alpine.store('contactModal').openModal()" class="font-arial font-semibold text-[18px] md:text-[20px] leading-[1.3] text-white underline decoration-solid underline-offset-[3px] decoration-skip-ink-none hover:text-white/80 transition-colors">Check availability</a>
  </div>`
  container.innerHTML = html
}

function populateImages() {
  const images = siteContent.images || []
  const heroImg = images[0]?.url
  const talksImg = images[1]?.url || heroImg

  // Hero image (full-width background behind trusted by)
  const heroImage = document.getElementById('hero-image')
  if (heroImage && heroImg) heroImage.style.backgroundImage = `url('${heroImg}')`

  // Talks image — desktop (absolute) and mobile (relative)
  const talksDesktop = document.getElementById('talks-desktop-image')
  if (talksDesktop && talksImg) talksDesktop.style.backgroundImage = `url('${talksImg}')`
  const talksMobile = document.getElementById('talks-image-mobile')
  if (talksMobile && talksImg) talksMobile.style.backgroundImage = `url('${talksImg}')`
}

// ── Alpine Store: Contact Modal ─────────────────────────────────────

Alpine.store('contactModal', {
  open: false,
  selectedTalk: null,

  openModal(talkId = null) {
    this.open = true
    this.selectedTalk = talkId
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      const modalComponent = document.querySelector('[x-data*="contactModal"]')
      if (modalComponent && modalComponent._x_dataStack) {
        const data = modalComponent._x_dataStack[0]
        if (data.resetForm) data.resetForm()
      }
      const nameInput = document.getElementById('name')
      if (nameInput) nameInput.focus()
    }, 100)

    this.populateModalContent(talkId)
    document.addEventListener('keydown', this.handleEscKey)
    document.addEventListener('keydown', this.handleFocusTrap)
  },

  closeModal() {
    this.open = false
    this.selectedTalk = null
    document.body.style.overflow = ''
    document.removeEventListener('keydown', this.handleEscKey)
    document.removeEventListener('keydown', this.handleFocusTrap)
  },

  handleFocusTrap(e) {
    if (e.key !== 'Tab') return
    const modal = document.querySelector('.modal-content')
    if (!modal) return
    const focusable = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    if (focusable.length === 0) return
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
    else { if (document.activeElement === last) { e.preventDefault(); first.focus() } }
  },

  populateModalContent(talkId) {
    if (talkId && siteContent.talks) {
      const talk = siteContent.talks.find(t => t.id === parseInt(talkId))
      if (talk?.modal) {
        const iconEl = document.getElementById('modal-icon')
        if (iconEl) { iconEl.innerHTML = talk.modal.icon || ''; iconEl.style.display = talk.modal.icon ? '' : 'none' }
        const titleEl = document.getElementById('modal-title')
        if (titleEl) titleEl.textContent = talk.modal.title
        const descEl = document.getElementById('modal-description')
        if (descEl) descEl.textContent = talk.modal.description
        const subtitleEl = document.getElementById('modal-subtitle-main')
        if (subtitleEl) {
          if (typeof talk.modal.subtitle === 'string') { subtitleEl.textContent = talk.modal.subtitle }
          else { subtitleEl.textContent = talk.modal.subtitle?.main || '' }
        }
        const hiddenField = document.getElementById('selectedTalk')
        if (hiddenField) hiddenField.value = `${talk.title} (ID: ${talkId})`
        const submitIcon = document.getElementById('submit-icon')
        if (submitIcon && siteContent.modal?.contact?.form?.submitIcon) {
          submitIcon.innerHTML = siteContent.modal.contact.form.submitIcon.replace(/fill="#0D3DFF"/g, 'fill="white"')
        }
        return
      }
    }

    // Generic booking mode
    const booking = siteContent.booking?.modal
    if (booking) {
      const iconEl = document.getElementById('modal-icon')
      if (iconEl) { iconEl.innerHTML = ''; iconEl.style.display = 'none' }
      const titleEl = document.getElementById('modal-title')
      if (titleEl) titleEl.textContent = booking.genericTitle || 'Book Frederick'
      const descEl = document.getElementById('modal-description')
      if (descEl) descEl.textContent = booking.genericDescription || ''
      const subtitleEl = document.getElementById('modal-subtitle-main')
      if (subtitleEl) subtitleEl.textContent = booking.subtitle || 'No commitment before our initial chat.'
      const hiddenField = document.getElementById('selectedTalk')
      if (hiddenField) hiddenField.value = 'General inquiry'
      const submitIcon = document.getElementById('submit-icon')
      if (submitIcon && siteContent.modal?.contact?.form?.submitIcon) {
        submitIcon.innerHTML = siteContent.modal.contact.form.submitIcon.replace(/fill="#0D3DFF"/g, 'fill="white"')
      }
    }
  },

  handleEscKey(event) {
    if (event.key === 'Escape') {
      const modalComponent = document.querySelector('[x-data*="contactModal"]')
      if (modalComponent && modalComponent._x_dataStack) {
        const data = modalComponent._x_dataStack[0]
        if (!data.submitting && !data.success) Alpine.store('contactModal').closeModal()
      }
    }
  }
})

// ── Alpine Components ───────────────────────────────────────────────

Alpine.data('contactModal', () => ({
  submitting: false,
  success: false,
  closeModal() { if (!this.submitting && !this.success) Alpine.store('contactModal').closeModal() },
  resetForm() { this.submitting = false; this.success = false; const form = document.querySelector('form'); if (form) form.reset() },
  async submitForm(event) {
    event.preventDefault()
    if (this.submitting || this.success) return
    this.submitting = true
    const formData = new FormData(event.target)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'),
          selectedTalk: formData.get('selectedTalk'), eventType: formData.get('eventType'), message: formData.get('message')
        })
      })
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) throw new Error(`Server returned ${response.status}`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to send email')
      this.submitting = false; this.success = true
      setTimeout(() => { Alpine.store('contactModal').closeModal(); setTimeout(() => { this.resetForm() }, 300) }, 1000)
    } catch (error) {
      console.error('Form submission error:', error)
      this.submitting = false
      alert(`Sorry, there was an error: ${error.message}. Please try again.`)
    }
  }
}))

Alpine.data('bookForm', () => ({
  submitting: false,
  success: false,
  error: false,
  async submit(event) {
    event.preventDefault()
    if (this.submitting || this.success) return
    this.submitting = true
    this.error = false
    const form = event.target
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || (result && result.status === 'error')) {
        throw new Error((result && result.message) || `Request failed (${response.status})`)
      }
      this.submitting = false
      this.success = true
      form.reset()
    } catch (e) {
      console.error('Book form submission error:', e)
      this.submitting = false
      this.error = true
    }
  }
}))

Alpine.data('tooltip', () => ({
  show: false, content: '', icon: '', isMobile: false,
  init() {
    this.content = this.$el.getAttribute('data-tooltip') || ''
    this.icon = this.$el.getAttribute('data-tooltip-icon') || ''
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!this.$el.hasAttribute('tabindex')) this.$el.setAttribute('tabindex', '0')
    this.$el.setAttribute('role', 'button')
    this.$el.setAttribute('aria-expanded', 'false')
    if (this.isMobile) { this.$el.addEventListener('click', (e) => { e.preventDefault(); this.toggleTooltip() }) }
    else {
      this.$el.addEventListener('mouseenter', () => { this.showTooltip() })
      this.$el.addEventListener('mouseleave', () => { this.hideTooltip() })
      this.$el.addEventListener('click', (e) => { e.preventDefault(); this.toggleTooltip() })
    }
    this.$el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggleTooltip() } else if (e.key === 'Escape') { this.hideTooltip() } })
    if (this.isMobile) { document.addEventListener('click', (e) => { if (!this.$el.contains(e.target) && !this.$refs.tooltip?.contains(e.target)) this.hideTooltip() }) }
    window.addEventListener('resize', () => { if (this.show) this.positionTooltip() })
  },
  toggleTooltip() { this.show ? this.hideTooltip() : this.showTooltip() },
  showTooltip() { this.show = true; this.$el.setAttribute('aria-expanded', 'true'); this.$nextTick(() => { this.positionTooltip() }) },
  hideTooltip() { this.show = false; this.$el.setAttribute('aria-expanded', 'false') },
  positionTooltip() {
    const tooltip = this.$refs.tooltip; if (!tooltip) return
    const triggerRect = this.$el.getBoundingClientRect(); const tooltipRect = tooltip.getBoundingClientRect()
    const vw = window.innerWidth; const vh = window.innerHeight; const pad = 16
    tooltip.style.left = '50%'; tooltip.style.right = 'auto'; tooltip.style.top = 'calc(100% + 8px)'; tooltip.style.bottom = 'auto'; tooltip.style.transform = 'translateX(-50%)'
    const tl = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2; const tr = tl + tooltipRect.width
    if (tr > vw - pad) { tooltip.style.left = 'auto'; tooltip.style.right = '0'; tooltip.style.transform = 'none' }
    else if (tl < pad) { tooltip.style.left = '0'; tooltip.style.transform = 'none' }
    if (triggerRect.bottom + 8 + tooltipRect.height > vh - pad) { tooltip.style.top = 'auto'; tooltip.style.bottom = 'calc(100% + 8px)' }
  }
}))

Alpine.data('mobileNav', () => ({
  open: false,
  toggle() { this.open = !this.open },
  close() { this.open = false }
}))

Alpine.data('navigation', () => ({
  scrollToSection(sectionId) { const el = document.getElementById(sectionId); if (el) el.scrollIntoView({ behavior: 'smooth' }) }
}))

Alpine.data('stickyCta', () => ({
  visible: false,
  init() {
    const heroSection = document.getElementById('hero-section')
    const update = () => {
      // Visible once the hero has scrolled out of view...
      const pastHero = heroSection ? (heroSection.getBoundingClientRect().bottom <= 0) : (window.scrollY > 300)
      // ...and hidden only when the user actually reaches the bottom of the page.
      const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      const atBottom = (window.innerHeight + window.scrollY) >= (pageHeight - 160)
      this.visible = pastHero && !atBottom
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
  }
}))


// ── Click Handlers ──────────────────────────────────────────────────

document.addEventListener('click', function(e) {
  if (e.target.matches('.talk-action-btn') || e.target.closest('.talk-action-btn')) {
    e.preventDefault()
    const button = e.target.matches('.talk-action-btn') ? e.target : e.target.closest('.talk-action-btn')
    const talkId = button.getAttribute('data-talk-id')
    if (window.Alpine && Alpine.store && Alpine.store('contactModal')) {
      Alpine.store('contactModal').openModal(talkId)
    }
  }
})

// ── Initialize ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  Alpine.start()
  window.Alpine = Alpine
  loadContent()
})
