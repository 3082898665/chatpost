"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button, Popconfirm,ConfigProvider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { deleteThread } from "@/lib/actions/thread,action";

import '../../app/globals.css'
interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk =async () => {
    await deleteThread(JSON.parse(threadId), pathname);
    if (!parentId || !isComment) {
      router.push("/");
  }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: 'rgb(135,125,251)',
        borderRadius: 2,

        // 派生变量，影响范围小
        colorBgContainer: '#f6ffed',
      },
    }}
    
  >
    <Popconfirm
    title="Delete the thread"
    description="Are you sure to delete this thread?"
    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
  >
     <Image
      src='/assets/delete.svg'
      alt='delte'
      width={18}
      height={18}
      className='cursor-pointer object-contain h-[30px] mt-[-7px]'
      onClick={showPopconfirm}
    />
  </Popconfirm>
  </ConfigProvider>
  );
}

export default DeleteThread;
