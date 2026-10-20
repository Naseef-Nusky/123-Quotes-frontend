/**
 * Banner image for every public page.
 * Photos: Unsplash (same CDN already used by the home popular-services cards).
 */
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`

export const BANNERS = {
  howItWorks: u('photo-1521791136064-7986c2920216'), // handshake / agreement
  pricing: u('photo-1554224155-6726b3ff858f'), // calculator & finance
  contact: u('photo-1486312338219-ce68d2c6f44d'), // person working on laptop
  professionals: u('photo-1521737604893-d14cc237f11d'), // team of professionals
  professionalProfile: u('photo-1560250097-0b93528c311a'), // professional portrait
  serviceDetail: u('photo-1454165804606-c3d57bc86b40'), // planning a project
  categoryDetail: u('photo-1497366216548-37526070297c'), // modern office
  login: u('photo-1556742049-0cfed4f6a45d'), // customer paying / service
  businessSignup: u('photo-1486406146926-c627a92ad1ab'), // business building
  terms: u('photo-1450101499163-c8848c66ca85'), // signing a document
  privacy: u('photo-1550751827-4bd374c3f58b'), // digital security
}

/** Rotating cover images for category cards (picked by category name). */
export const CATEGORY_IMAGES = [
  u('photo-1498050108023-c5249f4df085'), // web / tech
  u('photo-1519741497674-611481863552'), // photography
  u('photo-1581578731548-c64695cc6952'), // cleaning
  u('photo-1454165804606-c3d57bc86b40'), // professional planning
  u('photo-1521791136064-7986c2920216'), // handshake
  u('photo-1497366216548-37526070297c'), // office
  u('photo-1486406146926-c627a92ad1ab'), // business building
  u('photo-1560250097-0b93528c311a'), // professional portrait
]

export function categoryImage(category, index = 0) {
  const name = String(category?.name || category?.slug || '')
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return CATEGORY_IMAGES[(hash + index) % CATEGORY_IMAGES.length]
}
