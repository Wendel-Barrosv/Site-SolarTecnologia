'use client'
import { useEffect } from 'react'

export default function RevealScript() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    document
      .querySelectorAll(
      'section .section-head, section .inside-heading > *, section .inside-frame, section .modules-grid > *, section .benefits-grid > *, section .capabilities > *, section .brands-marquee, section .scale-signals > *, section .regional-grid > *, section .pillars > *'
      )
      .forEach((el, i) => {
        el.classList.add('reveal')
        ;(el as HTMLElement).style.animationDelay = (i % 6) * 0.05 + 's'
        io.observe(el)
      })

    return () => io.disconnect()
  }, [])

  return null
}
