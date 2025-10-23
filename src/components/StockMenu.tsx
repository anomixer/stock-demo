'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { MoreVertical, Edit, Trash2, Check, X } from 'lucide-react'
import { Stock } from '@/types/stock'

interface StockMenuProps {
    stock: Stock
    onEdit: (stock: Stock) => void
    onDelete: (stock: Stock) => void
    isDark?: boolean
}

export const StockMenu = ({ stock, onEdit, onDelete, isDark = false }: StockMenuProps) => {

    const [isOpen, setIsOpen] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)



    // 點擊外部關閉選單

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {

                setIsOpen(false)

            }

        }



        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)

    }, [])



    return (

        <div className="relative" ref={menuRef}>

            <Button

                variant="ghost"

                size="sm"

                onClick={() => setIsOpen(!isOpen)}

                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"

            >

                <MoreVertical className="w-4 h-4" />

            </Button>



            {isOpen && (

                <Card className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-10">

                    <div className="py-1">

                        <button

                            onClick={() => {

                                onEdit(stock)

                                setIsOpen(false)

                            }}

                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"

                        >

                            <Edit className="w-4 h-4" />

                            編輯

                        </button>

                        <button

                            onClick={() => {

                                onDelete(stock)

                                setIsOpen(false)

                            }}

                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"

                        >

                            <Trash2 className="w-4 h-4" />

                            刪除

                        </button>

                    </div>

                </Card>

            )}

        </div>

    )

}


