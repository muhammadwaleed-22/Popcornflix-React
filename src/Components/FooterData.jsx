import React from 'react'

function FooterData() {
  return (
    <footer className="justify-center border-t border-white/20 py-4 w-full bg-black/20 text-center z-10">
      <p className="text-sm text-[#051f20]">
        &copy; {new Date().getFullYear()} Popcornflix. All rights reserved.
      </p>
    </footer>
  )
}

export default FooterData


